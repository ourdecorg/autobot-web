export type ServiceStatus =
  | 'pending'
  | 'inspector_assigned'
  | 'inspector_en_route'
  | 'inspection_in_progress'
  | 'inspection_passed'
  | 'inspection_failed'
  | 'transport_en_route'
  | 'at_institute'
  | 'test_in_progress'
  | 'test_passed'
  | 'test_failed'
  | 'completed';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
}

export interface Address {
  street: string;
  houseNumber: string;
  city: string;
  apartment?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  idNumber: string;
}

export interface Inspector {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  assignedBookingIds: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  vehicle: Vehicle;
  address: Address;
  scheduledDate: string;
  scheduledTime: string;
  status: ServiceStatus;
  createdAt: Date;
  price: number;
  inspectorName?: string;
  inspectorPhone?: string;
  inspectorId?: string;
  inspectorLocation?: Coordinates;
  vehicleLocation?: Coordinates;
  instituteAddress?: string;
  notes?: string;
}

export interface CreateBookingInput {
  customerId: string;
  vehicle: Vehicle;
  address: Address;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}

export interface StatusStep {
  status: ServiceStatus;
  label: string;
  completed: boolean;
  active: boolean;
  failed: boolean;
}
