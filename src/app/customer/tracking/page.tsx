'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import TrackingMap from '@/components/customer/TrackingMap';
import StatusTimeline from '@/components/shared/StatusTimeline';
import StatusBadge from '@/components/shared/StatusBadge';
import { STATUS_DESCRIPTIONS, getProgressPercent, formatPrice } from '@/utils/statusHelpers';
import { Phone, ArrowRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useState } from 'react';

function TrackingContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const { bookings } = useShared();
  const router = useRouter();
  const [timelineOpen, setTimelineOpen] = useState(false);
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="text-5xl">🔍</span>
        <p className="text-gray-500">לא נמצאה הזמנה</p>
        <button onClick={() => router.push('/customer/home')} className="text-primary font-medium">חזרה לבית</button>
      </div>
    );
  }

  const progress = getProgressPercent(booking.status);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-3 bg-white border-b border-gray-100 z-10">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowRight size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">{booking.vehicle.make} {booking.vehicle.model}</h1>
          <p className="text-xs text-gray-500">{booking.vehicle.licensePlate}</p>
        </div>
        <StatusBadge status={booking.status} size="sm" />
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <TrackingMap booking={booking} />
        </div>
        {/* Status overlay on map */}
        <div className="absolute top-3 right-3 left-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
            <p className="text-xs text-gray-500 mb-0.5">{STATUS_DESCRIPTIONS[booking.status]}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-bold text-primary">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="bg-white border-t border-gray-100 shadow-2xl max-h-[55vh] overflow-y-auto">
        {/* Inspector bar */}
        {booking.inspectorName && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {booking.inspectorName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{booking.inspectorName}</p>
              <p className="text-xs text-gray-500">בוחן מוסמך</p>
            </div>
            {booking.inspectorPhone && (
              <a href={`tel:${booking.inspectorPhone}`} className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-primary" />
              </a>
            )}
          </div>
        )}

        {/* Booking info */}
        <div className="px-4 py-3 flex gap-4 border-b border-gray-50">
          <div className="flex-1">
            <p className="text-xs text-gray-500">רכב</p>
            <p className="text-sm font-medium">{booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">מועד</p>
            <p className="text-sm font-medium">{booking.scheduledDate} • {booking.scheduledTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">מחיר</p>
            <p className="text-sm font-bold text-primary">{formatPrice(booking.price)}</p>
          </div>
        </div>

        {/* Timeline toggle */}
        <button
          className="flex items-center justify-between w-full px-4 py-3 border-b border-gray-50"
          onClick={() => setTimelineOpen(!timelineOpen)}
        >
          <span className="font-semibold text-gray-900 text-sm">שלבי השירות</span>
          {timelineOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>

        {timelineOpen && (
          <div className="px-4 py-4">
            <StatusTimeline status={booking.status} />
          </div>
        )}

        {/* Institute */}
        {booking.instituteAddress && (
          <div className="px-4 py-3 flex items-center gap-2">
            <MapPin size={16} className="text-accent flex-shrink-0" />
            <span className="text-sm text-gray-600">{booking.instituteAddress}</span>
          </div>
        )}

        {/* Complete button */}
        {booking.status === 'completed' && (
          <div className="px-4 py-4">
            <div className="bg-green-50 rounded-xl p-4 text-center mb-3">
              <p className="text-success font-bold text-lg">השירות הושלם בהצלחה! 🎉</p>
              <p className="text-gray-600 text-sm">תודה שבחרת באוטובוט</p>
            </div>
            <button
              onClick={() => router.push('/customer/home')}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark"
            >
              חזרה לבית
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  );
}
