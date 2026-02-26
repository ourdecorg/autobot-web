'use client';
import { useShared } from '@/context/SharedContext';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { formatShortDate, formatPrice, isServiceActive } from '@/utils/statusHelpers';
import { MapPin, Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { bookings } = useShared();
  const router = useRouter();
  const active = bookings.filter((b) => isServiceActive(b.status)).length;
  const completed = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-4 pt-10 pb-5" style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #2D5E8E 100%)' }}>
        <h1 className="text-white text-xl font-bold mb-4">היסטוריית הזמנות</h1>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'סה"כ', value: bookings.length },
            { label: 'פעילות', value: active },
            { label: 'הושלמו', value: completed },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white text-xl font-black">{value}</p>
              <p className="text-white/70 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {bookings.length === 0 ? (
          <EmptyState
            title="אין הזמנות עדיין"
            subtitle="הזמן שירות ראשון ותוכל לעקוב אחריו כאן"
            icon="📋"
            action={
              <Link href="/customer/booking" className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm">
                הזמן שירות
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const active = isServiceActive(booking.status);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => active
                    ? router.push(`/customer/tracking?bookingId=${booking.id}`)
                    : undefined
                  }
                >
                  <div className={`h-1 ${active ? 'bg-primary' : booking.status === 'completed' ? 'bg-success' : 'bg-error'}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{booking.vehicle.make} {booking.vehicle.model}</p>
                        <p className="text-sm text-gray-500">{booking.vehicle.licensePlate} • {booking.vehicle.year}</p>
                      </div>
                      <StatusBadge status={booking.status} size="sm" />
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        <span>{booking.address.street} {booking.address.houseNumber}, {booking.address.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>{formatShortDate(booking.scheduledDate)} • {booking.scheduledTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                      <span className={`text-sm font-bold ${booking.status === 'test_failed' || booking.status === 'inspection_failed' ? 'text-error' : 'text-success'}`}>
                        {formatPrice(booking.price)}
                      </span>
                      {active && (
                        <span className="flex items-center gap-1 text-primary text-sm font-medium">
                          מעקב <ChevronLeft size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
