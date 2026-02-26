'use client';
import { useShared } from '@/context/SharedContext';
import { formatPrice } from '@/utils/statusHelpers';
import { TrendingUp, CheckCircle, XCircle, Clock, DollarSign, Users, Car } from 'lucide-react';

export default function StatsPage() {
  const { bookings, inspectors } = useShared();

  const total = bookings.length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const failed = bookings.filter((b) => b.status === 'inspection_failed' || b.status === 'test_failed').length;
  const active = bookings.filter((b) => b.status !== 'completed' && b.status !== 'inspection_failed' && b.status !== 'test_failed').length;
  const revenue = completed * 299;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeInspectors = inspectors.filter((i) => i.isActive).length;

  const kpis = [
    { icon: <Car size={22} className="text-blue-500" />, label: 'סה"כ הזמנות', value: total, bg: 'bg-blue-50' },
    { icon: <CheckCircle size={22} className="text-green-500" />, label: 'הושלמו', value: completed, bg: 'bg-green-50' },
    { icon: <XCircle size={22} className="text-red-500" />, label: 'נכשלו', value: failed, bg: 'bg-red-50' },
    { icon: <Clock size={22} className="text-yellow-500" />, label: 'פעילות', value: active, bg: 'bg-yellow-50' },
    { icon: <DollarSign size={22} className="text-emerald-500" />, label: 'הכנסות', value: formatPrice(revenue), bg: 'bg-emerald-50' },
    { icon: <TrendingUp size={22} className="text-purple-500" />, label: 'אחוז השלמה', value: `${completionRate}%`, bg: 'bg-purple-50' },
    { icon: <Users size={22} className="text-indigo-500" />, label: 'בוחנים פעילים', value: activeInspectors, bg: 'bg-indigo-50' },
    { icon: <span className="text-xl">💰</span>, label: 'ממוצע לבוחן', value: activeInspectors > 0 ? formatPrice(Math.round(revenue / activeInspectors)) : '₪0', bg: 'bg-orange-50' },
  ];

  // Status distribution for bar chart
  const statusGroups = [
    { label: 'הושלם', value: completed, color: 'bg-success' },
    { label: 'נכשל', value: failed, color: 'bg-error' },
    { label: 'פעיל', value: active, color: 'bg-primary' },
  ];
  const maxVal = Math.max(...statusGroups.map((s) => s.value), 1);

  // Per-inspector stats
  const inspectorStats = inspectors.map((inspector) => {
    const inspBookings = bookings.filter((b) => b.inspectorId === inspector.id);
    const inspCompleted = inspBookings.filter((b) => b.status === 'completed').length;
    return { inspector, count: inspBookings.length, completed: inspCompleted };
  }).filter((s) => s.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">סטטיסטיקות</h1>
        <p className="text-gray-500 text-sm">נתוני ביצועים כלליים</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {kpis.map(({ icon, label, value, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4`}>
            <div className="mb-2">{icon}</div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">התפלגות הזמנות</h2>
        <div className="flex items-end gap-4 h-32">
          {statusGroups.map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-sm font-bold text-gray-700">{value}</span>
              <div
                className={`w-full ${color} rounded-t-lg transition-all duration-1000`}
                style={{ height: `${(value / maxVal) * 100}px` }}
              />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspector performance */}
      {inspectorStats.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">ביצועי בוחנים</h2>
          <div className="space-y-3">
            {inspectorStats.map(({ inspector, count, completed }) => {
              const rate = count > 0 ? Math.round((completed / count) * 100) : 0;
              return (
                <div key={inspector.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {inspector.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{inspector.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{count} הזמנות</span>
                      <span className="font-bold text-primary">{rate}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${rate}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
