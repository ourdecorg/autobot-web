'use client';
import { useShared } from '@/context/SharedContext';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import { Booking } from '@/types';
import { isServiceActive, formatShortDate } from '@/utils/statusHelpers';
import { Car, MapPin, Calendar, ChevronLeft, Clock, CheckCircle } from 'lucide-react';

export default function ProviderDashboardPage() {
  const { bookings, inspectors } = useShared();
  const router = useRouter();
  const pending = bookings.filter((b) => b.status === 'pending');
  const active = bookings.filter((b) => isServiceActive(b.status) && b.status !== 'pending');
  const todayCompleted = bookings.filter((b) => b.status === 'completed').length;
  const activeInspectors = inspectors.filter((i) => i.isActive).length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">דשבורד</h1>
        <p className="text-gray-500 text-sm">סקירה כללית של הפעילות</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'ממתינות לאישור', value: pending.length, icon: <Clock size={20} className="text-yellow-500" />, bg: 'bg-yellow-50' },
          { label: 'הזמנות פעילות', value: active.length, icon: <Car size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'הושלמו היום', value: todayCompleted, icon: <CheckCircle size={20} className="text-green-500" />, bg: 'bg-green-50' },
          { label: 'בוחנים פעילים', value: activeInspectors, icon: <span className="text-xl">👷</span>, bg: 'bg-purple-50' },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4`}>
            <div className="flex items-center gap-2 mb-2">{icon}</div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending orders */}
      <section className="mb-6">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Clock size={18} className="text-yellow-500" />
          ממתינות לאישור ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm border border-gray-100">
            אין הזמנות ממתינות
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((booking) => (
              <OrderRow key={booking.id} booking={booking} onClick={() => router.push(`/provider/orders/${booking.id}`)} />

            ))}
          </div>
        )}
      </section>

      {/* Active orders */}
      <section>
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Car size={18} className="text-blue-500" />
          הזמנות פעילות ({active.length})
        </h2>
        {active.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm border border-gray-100">
            אין הזמנות פעילות כרגע
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((booking) => (
              <OrderRow key={booking.id} booking={booking} onClick={() => router.push(`/provider/orders/${booking.id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OrderRow({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-bold text-gray-900">{booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}</p>
          <p className="text-sm text-gray-500">{booking.vehicle.licensePlate}</p>
        </div>
        <StatusBadge status={booking.status} size="sm" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} />
          <span className="truncate">{booking.address.city}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={13} />
          <span>{formatShortDate(booking.scheduledDate)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">#{booking.id}</span>
        {booking.inspectorName && (
          <span className="text-xs text-blue-600 font-medium">👷 {booking.inspectorName}</span>
        )}
        <ChevronLeft size={14} className="text-gray-300" />
      </div>
    </div>
  );
}
