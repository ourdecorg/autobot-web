'use client';
import React, { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react';
import { Customer, Inspector, Booking, ServiceStatus, CreateBookingInput } from '@/types';
import { MOCK_CUSTOMER, MOCK_INSPECTORS, SEED_PAST_BOOKINGS, TEL_AVIV_CENTER, INSTITUTE_LOCATION } from '@/utils/mockData';
import { startSimulation, SimulationHandle } from '@/utils/simulation';

interface SharedContextType {
  // Customer auth
  customer: Customer | null;
  isCustomerLoggedIn: boolean;
  loginCustomer: (phone: string, password: string) => Promise<boolean>;
  logoutCustomer: () => void;

  // Provider auth
  isProviderLoggedIn: boolean;
  loginProvider: (email: string, password: string) => Promise<boolean>;
  logoutProvider: () => void;

  // Bookings
  bookings: Booking[];
  activeBooking: Booking | null;
  createBooking: (data: CreateBookingInput) => Booking;
  updateBookingStatus: (id: string, status: ServiceStatus) => void;
  updateBookingField: (id: string, fields: Partial<Booking>) => void;

  // Inspectors
  inspectors: Inspector[];
  addInspector: (inspector: Omit<Inspector, 'id'>) => void;
  updateInspector: (id: string, fields: Partial<Inspector>) => void;
  deleteInspector: (id: string) => void;
  assignInspector: (bookingId: string, inspectorId: string) => void;

  // Simulation
  stopSimulation: (bookingId: string) => void;
}

const SharedContext = createContext<SharedContextType | null>(null);

export function SharedProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isProviderLoggedIn, setIsProviderLoggedIn] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(SEED_PAST_BOOKINGS);
  const [inspectors, setInspectors] = useState<Inspector[]>(MOCK_INSPECTORS);
  const simulationsRef = useRef<Map<string, SimulationHandle>>(new Map());

  const activeBooking = useMemo(
    () => bookings.find((b) =>
      b.status !== 'completed' && b.status !== 'inspection_failed' && b.status !== 'test_failed'
    ) ?? null,
    [bookings]
  );

  // --- Auth ---
  const loginCustomer = useCallback(async (phone: string, password: string): Promise<boolean> => {
    void password;
    await new Promise((r) => setTimeout(r, 800));
    if (phone.replace(/\D/g, '').length >= 9) {
      setCustomer(MOCK_CUSTOMER);
      setIsCustomerLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const logoutCustomer = useCallback(() => {
    setCustomer(null);
    setIsCustomerLoggedIn(false);
  }, []);

  const loginProvider = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    if (email === 'admin@autobot.co.il' && password === 'admin123') {
      setIsProviderLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const logoutProvider = useCallback(() => {
    setIsProviderLoggedIn(false);
  }, []);

  // --- Bookings ---
  const updateBookingStatus = useCallback((id: string, status: ServiceStatus) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  }, []);

  const updateBookingField = useCallback((id: string, fields: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, ...fields } : b));
  }, []);

  const stopSimulation = useCallback((bookingId: string) => {
    const handle = simulationsRef.current.get(bookingId);
    if (handle) {
      handle.stop();
      simulationsRef.current.delete(bookingId);
    }
  }, []);

  const createBooking = useCallback((data: CreateBookingInput): Booking => {
    const firstInspector = inspectors.find((i) => i.isActive);
    const newBooking: Booking = {
      ...data,
      id: `B${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
      price: 299,
      inspectorName: firstInspector?.name ?? 'אלי כהן',
      inspectorPhone: firstInspector?.phone ?? '052-9876543',
      inspectorId: firstInspector?.id,
      vehicleLocation: { ...TEL_AVIV_CENTER },
      instituteAddress: 'מכון רישוי תל אביב, רח\' הרצל 10',
    };

    setBookings((prev) => [newBooking, ...prev]);

    const handle = startSimulation(newBooking.id, {
      onStatusChange: (bookingId, status) => {
        setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b));
      },
      onLocationUpdate: (bookingId, field, coords) => {
        setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, [field]: coords } : b));
      },
      onVehicleAtInstitute: (bookingId) => {
        setBookings((prev) => prev.map((b) =>
          b.id === bookingId ? { ...b, vehicleLocation: { ...INSTITUTE_LOCATION } } : b
        ));
      },
    });

    simulationsRef.current.set(newBooking.id, handle);
    return newBooking;
  }, [inspectors]);

  // --- Inspectors ---
  const addInspector = useCallback((inspector: Omit<Inspector, 'id'>) => {
    const newInspector: Inspector = { ...inspector, id: `i${Date.now()}` };
    setInspectors((prev) => [...prev, newInspector]);
  }, []);

  const updateInspector = useCallback((id: string, fields: Partial<Inspector>) => {
    setInspectors((prev) => prev.map((i) => i.id === id ? { ...i, ...fields } : i));
  }, []);

  const deleteInspector = useCallback((id: string) => {
    setInspectors((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const assignInspector = useCallback((bookingId: string, inspectorId: string) => {
    const inspector = inspectors.find((i) => i.id === inspectorId);
    if (!inspector) return;
    setBookings((prev) => prev.map((b) =>
      b.id === bookingId
        ? { ...b, inspectorId, inspectorName: inspector.name, inspectorPhone: inspector.phone }
        : b
    ));
    setInspectors((prev) => prev.map((i) =>
      i.id === inspectorId ? { ...i, assignedBookingIds: [...i.assignedBookingIds, bookingId] } : i
    ));
  }, [inspectors]);

  const value = useMemo(() => ({
    customer, isCustomerLoggedIn, loginCustomer, logoutCustomer,
    isProviderLoggedIn, loginProvider, logoutProvider,
    bookings, activeBooking, createBooking, updateBookingStatus, updateBookingField,
    inspectors, addInspector, updateInspector, deleteInspector, assignInspector,
    stopSimulation,
  }), [
    customer, isCustomerLoggedIn, loginCustomer, logoutCustomer,
    isProviderLoggedIn, loginProvider, logoutProvider,
    bookings, activeBooking, createBooking, updateBookingStatus, updateBookingField,
    inspectors, addInspector, updateInspector, deleteInspector, assignInspector,
    stopSimulation,
  ]);

  return <SharedContext.Provider value={value}>{children}</SharedContext.Provider>;
}

export function useShared() {
  const ctx = useContext(SharedContext);
  if (!ctx) throw new Error('useShared must be used within SharedProvider');
  return ctx;
}
