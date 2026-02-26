'use client';
import { useShared } from '@/context/SharedContext';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import { STATUS_DESCRIPTIONS, getProgressPercent } from '@/utils/statusHelpers';
import { Bell, ChevronLeft, Plus, CheckCircle, Wrench, Shield, Truck, Navigation } from 'lucide-react';

export default function CustomerHomePage() {
  const { customer, bookings, activeBooking } = useShared();
  const router = useRouter();
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const active = bookings.filter((b) => b.status !== 'completed' && b.status !== 'inspection_failed' && b.status !== 'test_failed').length;

  const features = [
    { icon: <Wrench className="text-blue-500" size={24} />, title: 'בדיקה ביתית', desc: 'בוחן מגיע אליך' },
    { icon: <Shield className="text-green-500" size={24} />, title: 'בדיקה מקצועית', desc: 'בוחן מוסמך' },
    { icon: <Truck className="text-purple-500" size={24} />, title: 'הסעת רכב', desc: 'למכון הרישוי' },
    { icon: <Navigation className="text-orange-500" size={24} />, title: 'מעקב GPS', desc: 'בזמן אמת' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 pt-10 pb-5" style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #2D5E8E 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm">שלום,</p>
            <h1 className="text-white text-xl font-bold">{customer?.firstName} {customer?.lastName}</h1>
          </div>
          <button className="relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Bell size={20} className="text-white" />
            {active > 0 && <span className="absolute top-1 left-1 w-2.5 h-2.5 bg-accent rounded-full pulse-dot" />}
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'סה"כ', value: bookings.length },
            { label: 'הושלמו', value: completed },
            { label: 'פעילות', value: active },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white text-xl font-black">{value}</p>
              <p className="text-white/70 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Active booking */}
        {activeBooking ? (
          <div
            className="rounded-2xl p-4 text-white cursor-pointer shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5E8E)' }}
            onClick={() => router.push(`/customer/tracking?bookingId=${activeBooking.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent pulse-dot" />
                <span className="text-white/80 text-sm font-medium">הזמנה פעילה</span>
              </div>
              <StatusBadge status={activeBooking.status} size="sm" />
            </div>
            <p className="font-bold text-lg mb-1">{activeBooking.vehicle.make} {activeBooking.vehicle.model} {activeBooking.vehicle.year}</p>
            <p className="text-white/70 text-sm mb-3">{STATUS_DESCRIPTIONS[activeBooking.status]}</p>
            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-1">
              <div
                className="h-2 rounded-full bg-accent transition-all duration-500"
                style={{ width: `${getProgressPercent(activeBooking.status)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{getProgressPercent(activeBooking.status)}% הושלם</span>
              <span className="flex items-center gap-1">לחץ למעקב <ChevronLeft size={12} /></span>
            </div>
          </div>
        ) : (
          // CTA
          <div
            className="rounded-2xl p-5 text-white cursor-pointer shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F4A261, #E76F51)' }}
            onClick={() => router.push('/customer/booking')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus size={24} />
              </div>
              <div>
                <p className="font-bold text-lg">הזמן שירות עכשיו</p>
                <p className="text-white/80 text-sm">בדיקה טכנית + טסט עד הבית</p>
              </div>
              <ChevronLeft size={20} className="mr-auto" />
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">השירותים שלנו</h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2">{icon}</div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">איך זה עובד?</h2>
          <div className="space-y-3">
            {[
              { n: '1', text: 'הזמן שירות דרך האפליקציה', icon: '📱' },
              { n: '2', text: 'בוחן מגיע אליך לבדיקה טכנית', icon: '🔧' },
              { n: '3', text: 'הרכב נסחב למכון הרישוי', icon: '🚛' },
              { n: '4', text: 'עוקב בזמן אמת דרך המפה', icon: '📍' },
            ].map(({ n, text, icon }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <span className="text-sm text-gray-700">{text}</span>
                <span className="mr-auto text-xl">{icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F, #2D5E8E)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">חבילה מלאה</h2>
            <span className="text-3xl font-black text-accent">₪299</span>
          </div>
          <div className="space-y-1.5">
            {['בדיקה טכנית ביתית', 'הסעה למכון רישוי', 'טסט רשמי', 'מעקב GPS', 'בוחן מוסמך'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle size={14} className="text-success flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push('/customer/booking')}
            className="w-full mt-4 py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-dark"
          >
            הזמן עכשיו
          </button>
        </div>
      </div>
    </div>
  );
}
