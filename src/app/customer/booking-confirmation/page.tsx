'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import { CheckCircle, Phone, Navigation, Home } from 'lucide-react';
import { Suspense } from 'react';

function ConfirmationContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const { bookings } = useShared();
  const router = useRouter();
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Success icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-slide-up">
            <CheckCircle size={48} className="text-success" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">ההזמנה אושרה!</h1>
          <p className="text-gray-500 text-sm">הצוות שלנו בדרך אליך</p>
          <div className="flex gap-1 mt-3 text-2xl">
            {['🎉', '✨', '🎊', '✨', '🎉'].map((e, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }} className="animate-bounce">{e}</span>
            ))}
          </div>
        </div>

        {/* Booking details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">מספר הזמנה</span>
            <span className="font-bold text-primary">#{booking.id}</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">
            {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
          </div>
          <div className="text-sm text-gray-500">
            {booking.scheduledDate} • {booking.scheduledTime}
          </div>
        </div>

        {/* Inspector */}
        {booking.inspectorName && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {booking.inspectorName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-xs text-blue-600 mb-0.5">הבוחן שלך</p>
              <p className="font-bold text-gray-900">{booking.inspectorName}</p>
              <p className="text-sm text-gray-500">{booking.inspectorPhone}</p>
            </div>
            <a href={`tel:${booking.inspectorPhone}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Phone size={18} className="text-primary" />
            </a>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={() => router.push(`/customer/tracking?bookingId=${booking.id}`)}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold mb-3 flex items-center justify-center gap-2 hover:bg-primary-dark"
        >
          <Navigation size={20} />
          עקוב אחרי השירות
        </button>
        <button
          onClick={() => router.replace('/customer/home')}
          className="w-full py-3.5 rounded-xl border-2 border-primary text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5"
        >
          <Home size={18} />
          חזרה לבית
        </button>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
