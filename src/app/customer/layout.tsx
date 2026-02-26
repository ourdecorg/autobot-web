'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import CustomerNav from '@/components/customer/CustomerNav';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { isCustomerLoggedIn } = useShared();
  const router = useRouter();
  const path = usePathname();
  const isLoginPage = path === '/customer/login';

  useEffect(() => {
    if (!isCustomerLoggedIn && !isLoginPage) {
      router.replace('/customer/login');
    }
  }, [isCustomerLoggedIn, isLoginPage, router]);

  if (!isCustomerLoggedIn && !isLoginPage) return null;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <main className={!isLoginPage ? 'flex-1 pb-20' : 'flex-1'}>
        {children}
      </main>
      {!isLoginPage && <CustomerNav />}
    </div>
  );
}
