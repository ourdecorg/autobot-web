'use client';
import { useShared } from '@/context/SharedContext';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { useState } from 'react';
import { User, Car, Bell, Shield, HelpCircle, FileText, Star, ChevronLeft, LogOut, BadgeCheck } from 'lucide-react';

const menuItems = [
  { icon: User, label: 'פרטים אישיים', color: 'text-blue-500' },
  { icon: Car, label: 'הרכבים שלי', color: 'text-green-500' },
  { icon: Bell, label: 'התראות', color: 'text-yellow-500' },
  { icon: Shield, label: 'אבטחה', color: 'text-purple-500' },
  { icon: HelpCircle, label: 'עזרה ותמיכה', color: 'text-gray-500' },
  { icon: FileText, label: 'תנאי שימוש', color: 'text-gray-500' },
  { icon: Star, label: 'דרג אותנו', color: 'text-orange-500' },
];

export default function ProfilePage() {
  const { customer, logoutCustomer } = useShared();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logoutCustomer();
    router.replace('/customer/login');
  };

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-4 pt-10 pb-8" style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #2D5E8E 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-black">
            {customer.firstName.charAt(0)}
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">{customer.firstName} {customer.lastName}</h1>
            <p className="text-white/70 text-sm">{customer.phone}</p>
            <p className="text-white/60 text-xs">{customer.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* ID card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <BadgeCheck size={22} className="text-primary" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">תעודת זהות</p>
            <p className="font-semibold text-gray-900" dir="ltr">{customer.idNumber}</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">מאומת</span>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {menuItems.map(({ icon: Icon, label, color }) => (
            <button key={label} className="flex items-center gap-3 w-full px-4 py-4 hover:bg-gray-50 text-right">
              <div className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <span className="flex-1 text-gray-900 font-medium text-sm">{label}</span>
              <ChevronLeft size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">גרסה 1.0.0</p>

        <button
          onClick={() => setShowLogout(true)}
          className="w-full py-3.5 rounded-xl border-2 border-error text-error font-bold flex items-center justify-center gap-2 hover:bg-red-50"
        >
          <LogOut size={18} />
          התנתקות
        </button>
      </div>

      <ConfirmModal
        open={showLogout}
        title="התנתקות"
        message="האם אתה בטוח שברצונך להתנתק?"
        confirmLabel="התנתק"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
        danger
      />
    </div>
  );
}
