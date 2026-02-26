'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, CalendarDays, BarChart3, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useShared } from '@/context/SharedContext';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { useState } from 'react';

const navItems = [
  { href: '/provider/dashboard', icon: LayoutDashboard, label: 'דשבורד' },
  { href: '/provider/inspectors', icon: Users, label: 'בוחנים' },
  { href: '/provider/schedule', icon: CalendarDays, label: 'לוח זמנים' },
  { href: '/provider/stats', icon: BarChart3, label: 'סטטיסטיקות' },
];

export default function ProviderSidebar() {
  const path = usePathname();
  const router = useRouter();
  const { logoutProvider } = useShared();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logoutProvider();
    router.replace('/provider/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-primary min-h-screen sticky top-0">
        <div className="px-5 pt-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <div>
              <h1 className="text-white font-black text-base leading-tight">אוטובוט</h1>
              <p className="text-white/60 text-xs">ממשק ניהול</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-6">
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 w-full"
          >
            <LogOut size={18} />
            התנתקות
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 right-0 left-0 bg-primary border-t border-white/10 z-40">
        <div className="flex">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = path.startsWith(href);
            return (
              <Link key={href} href={href} className={cn(
                'flex-1 flex flex-col items-center py-2.5 gap-0.5',
                active ? 'text-white' : 'text-white/50'
              )}>
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <ConfirmModal
        open={showLogout}
        title="התנתקות"
        message="האם לצאת מממשק הניהול?"
        confirmLabel="התנתק"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
        danger
      />
    </>
  );
}
