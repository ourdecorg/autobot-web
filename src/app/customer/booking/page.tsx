'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import { Vehicle, Address } from '@/types';
import StepIndicator from '@/components/customer/wizard/StepIndicator';
import Step1Vehicle from '@/components/customer/wizard/Step1Vehicle';
import Step2Address from '@/components/customer/wizard/Step2Address';
import Step3DateTime from '@/components/customer/wizard/Step3DateTime';
import Step4Confirm from '@/components/customer/wizard/Step4Confirm';
import { ArrowRight, ChevronRight } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const STEPS = ['פרטי רכב', 'כתובת', 'תאריך ושעה', 'אישור'];

export default function BookingPage() {
  const { customer, createBooking } = useShared();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vehicle, setVehicle] = useState<Partial<Vehicle>>({});
  const [address, setAddress] = useState<Partial<Address>>({});
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!vehicle.make) e.make = 'חובה';
      if (!vehicle.model) e.model = 'חובה';
      if (!vehicle.year) e.year = 'חובה';
      if (!vehicle.color) e.color = 'חובה';
      if (!vehicle.licensePlate) e.licensePlate = 'חובה';
    }
    if (step === 1) {
      if (!address.city) e.city = 'חובה';
      if (!address.street) e.street = 'חובה';
      if (!address.houseNumber) e.houseNumber = 'חובה';
    }
    if (step === 2) {
      if (!date) e.date = 'בחר תאריך';
      if (!time) e.time = 'בחר שעה';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (step < 3) { setStep(step + 1); return; }
    // Submit
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const booking = createBooking({
      customerId: customer!.id,
      vehicle: vehicle as Vehicle,
      address: address as Address,
      scheduledDate: date,
      scheduledTime: time,
      notes,
    });
    setLoading(false);
    router.replace(`/customer/booking-confirmation?bookingId=${booking.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 pt-10 pb-2">
          <button onClick={() => step > 0 ? setStep(step - 1) : router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowRight size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">הזמנת שירות</h1>
        </div>
        <StepIndicator steps={STEPS} current={step} />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{STEPS[step]}</h2>
        {step === 0 && <Step1Vehicle vehicle={vehicle} setVehicle={setVehicle} errors={errors} />}
        {step === 1 && <Step2Address address={address} setAddress={setAddress} errors={errors} />}
        {step === 2 && <Step3DateTime selectedDate={date} setDate={setDate} selectedTime={time} setTime={setTime} notes={notes} setNotes={setNotes} errors={errors} />}
        {step === 3 && <Step4Confirm vehicle={vehicle} address={address} date={date} time={time} notes={notes} />}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4">
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="sm" /> : (
            <>
              {step === 3 ? 'הזמן שירות - ₪299' : 'המשך'}
              {!loading && step < 3 && <ChevronRight size={20} />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
