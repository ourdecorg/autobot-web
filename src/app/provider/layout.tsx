'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import ProviderSidebar from '@/components/provider/ProviderSidebar';

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { isProviderLoggedIn } = useShared();
  const router = useRouter();
  const path = usePathname();
  const isLoginPage = path === '/provider/login';

  useEffect(() => {
    if (!isProviderLoggedIn && !isLoginPage) {
      router.replace('/provider/login');
    }
  }, [isProviderLoggedIn, isLoginPage, router]);

  if (!isProviderLoggedIn && !isLoginPage) return null;

  if (isLoginPage) {
    return <div className="min-h-screen bg-bg">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <ProviderSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
