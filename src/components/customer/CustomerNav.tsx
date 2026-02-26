'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clock, User, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useShared } from '@/context/SharedContext';

const tabs = [
  { href: '/customer/home', icon: Home, label: 'בית' },
  { href: '/customer/tracking', icon: MapPin, label: 'מעקב' },
  { href: '/customer/history', icon: Clock, label: 'היסטוריה' },
  { href: '/customer/profile', icon: User, label: 'פרופיל' },
];

export default function CustomerNav() {
  const path = usePathname();
  const { activeBooking } = useShared();

  return (
    <nav className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-100 safe-area-bottom z-40">
      <div className="flex">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = path.startsWith(href.split('?')[0]);
          const isTracking = href === '/customer/tracking';
          return (
            <Link
              key={href}
              href={isTracking && activeBooking ? `${href}?bookingId=${activeBooking.id}` : href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative',
                isActive ? 'text-primary' : 'text-gray-400'
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                {isTracking && activeBooking && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full pulse-dot border-2 border-white" />
                )}
              </div>
              <span className={cn('text-xs', isActive ? 'font-semibold' : 'font-normal')}>{label}</span>
              {isActive && <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
