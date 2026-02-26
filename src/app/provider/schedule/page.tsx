'use client';
import { useShared } from '@/context/SharedContext';
import StatusBadge from '@/components/shared/StatusBadge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function SchedulePage() {
  const { bookings, inspectors } = useShared();
  const router = useRouter();
  const [dateOffset, setDateOffset] = useState(0);
  const baseDate = addDays(new Date(), dateOffset);
  const dateStr = baseDate.toISOString().split('T')[0];

  const todayBookings = bookings.filter((b) => b.scheduledDate === dateStr);
  const activeInspectors = inspectors.filter((i) => i.isActive);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">לוח זמנים</h1>
          <p className="text-gray-500 text-sm">
            {baseDate.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDateOffset(dateOffset - 1)} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <ChevronRight size={18} />
          </button>
          <button onClick={() => setDateOffset(0)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">היום</button>
          <button onClick={() => setDateOffset(dateOffset + 1)} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      {todayBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-gray-500">אין הזמנות בתאריך זה</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-right">
                <th className="text-sm font-semibold text-gray-500 pb-3 pr-2">שעה</th>
                <th className="text-sm font-semibold text-gray-500 pb-3 pr-2">לקוח / רכב</th>
                <th className="text-sm font-semibold text-gray-500 pb-3 pr-2">כתובת</th>
                <th className="text-sm font-semibold text-gray-500 pb-3 pr-2">בוחן</th>
                <th className="text-sm font-semibold text-gray-500 pb-3 pr-2">סטטוס</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {todayBookings
                .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                .map((booking) => {
                  const inspector = inspectors.find((i) => i.id === booking.inspectorId);
                  return (
                    <tr
                      key={booking.id}
                      className="bg-white cursor-pointer hover:bg-gray-50 rounded-xl"
                      onClick={() => router.push(`/provider/orders/${booking.id}`)}
                    >
                      <td className="py-3 pr-2 pl-4 rounded-r-xl">
                        <span className="text-sm font-bold text-gray-900">{booking.scheduledTime}</span>
                      </td>
                      <td className="py-3 pr-2">
                        <p className="font-medium text-gray-900 text-sm">{booking.vehicle.make} {booking.vehicle.model}</p>
                        <p className="text-xs text-gray-500">{booking.vehicle.licensePlate}</p>
                      </td>
                      <td className="py-3 pr-2">
                        <p className="text-sm text-gray-700">{booking.address.city}</p>
                        <p className="text-xs text-gray-500">{booking.address.street} {booking.address.houseNumber}</p>
                      </td>
                      <td className="py-3 pr-2">
                        {inspector ? (
                          <span className="text-sm text-blue-600 font-medium">{inspector.name}</span>
                        ) : (
                          <span className="text-xs text-gray-400">לא משויך</span>
                        )}
                      </td>
                      <td className="py-3 pr-2 pl-4 rounded-l-xl">
                        <StatusBadge status={booking.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* All today's bookings summary by inspector */}
      {activeInspectors.length > 0 && todayBookings.length > 0 && (
        <div className="mt-6">
          <h2 className="font-bold text-gray-900 mb-3">עומס לפי בוחן</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activeInspectors.map((inspector) => {
              const count = todayBookings.filter((b) => b.inspectorId === inspector.id).length;
              return (
                <div key={inspector.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{inspector.name.charAt(0)}</div>
                    <p className="font-medium text-gray-900 text-sm">{inspector.name}</p>
                  </div>
                  <p className="text-2xl font-black text-primary">{count}</p>
                  <p className="text-xs text-gray-500">הזמנות היום</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
