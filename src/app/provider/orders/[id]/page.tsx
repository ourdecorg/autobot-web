'use client';
import { useParams, useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import StatusBadge from '@/components/shared/StatusBadge';
import StatusTimeline from '@/components/shared/StatusTimeline';
import OrderStatusStepper from '@/components/provider/OrderStatusStepper';
import TrackingMap from '@/components/customer/TrackingMap';
import { ArrowRight, Phone, Car, MapPin, Calendar } from 'lucide-react';
import { formatShortDate, formatPrice, STATUS_DESCRIPTIONS } from '@/utils/statusHelpers';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { bookings, inspectors, assignInspector } = useShared();
  const router = useRouter();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-gray-500">הזמנה לא נמצאה</p>
        <button onClick={() => router.back()} className="text-primary font-medium">חזור</button>
      </div>
    );
  }

  const activeInspectors = inspectors.filter((i) => i.isActive);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowRight size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{booking.vehicle.make} {booking.vehicle.model}</h1>
          <p className="text-gray-500 text-sm">#{booking.id}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Map */}
          <div className="h-56 rounded-2xl overflow-hidden shadow-sm">
            <TrackingMap booking={booking} />
          </div>

          {/* Status update */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">עדכון סטטוס</h3>
            <p className="text-sm text-gray-500 mb-3">{STATUS_DESCRIPTIONS[booking.status]}</p>
            <OrderStatusStepper booking={booking} />
          </div>

          {/* Assign inspector */}
          {!booking.inspectorId && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">שייך בוחן</h3>
              <select
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-gray-900 bg-white mb-2"
                onChange={(e) => e.target.value && assignInspector(booking.id, e.target.value)}
                defaultValue=""
              >
                <option value="">בחר בוחן</option>
                {activeInspectors.map((i) => (
                  <option key={i.id} value={i.id}>{i.name} ({i.phone})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Booking details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-bold text-gray-900 mb-1">פרטי הזמנה</h3>
            <InfoRow icon={<Car size={16} className="text-primary" />} label="רכב">
              {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year} — {booking.vehicle.color}
            </InfoRow>
            <InfoRow icon={<span className="text-sm">🔢</span>} label="לוחית">
              <span dir="ltr">{booking.vehicle.licensePlate}</span>
            </InfoRow>
            <InfoRow icon={<MapPin size={16} className="text-primary" />} label="כתובת">
              {booking.address.street} {booking.address.houseNumber}{booking.address.apartment ? ` דירה ${booking.address.apartment}` : ''}, {booking.address.city}
            </InfoRow>
            <InfoRow icon={<Calendar size={16} className="text-primary" />} label="מועד">
              {formatShortDate(booking.scheduledDate)} • {booking.scheduledTime}
            </InfoRow>
            <InfoRow icon={<span className="text-sm">💰</span>} label="מחיר">
              <strong className="text-primary">{formatPrice(booking.price)}</strong>
            </InfoRow>
            {booking.notes && (
              <InfoRow icon={<span className="text-sm">📝</span>} label="הערות">
                {booking.notes}
              </InfoRow>
            )}
          </div>

          {/* Inspector */}
          {booking.inspectorName && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">בוחן משויך</h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {booking.inspectorName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{booking.inspectorName}</p>
                  <p className="text-sm text-gray-500">{booking.inspectorPhone}</p>
                </div>
                {booking.inspectorPhone && (
                  <a href={`tel:${booking.inspectorPhone}`} className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone size={18} className="text-primary" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">ציר זמן</h3>
            <StatusTimeline status={booking.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <span className="text-xs text-gray-500">{label}: </span>
        <span className="text-sm text-gray-900">{children}</span>
      </div>
    </div>
  );
}
