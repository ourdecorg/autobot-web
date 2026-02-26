import type { Metadata } from 'next';
import './globals.css';
import { SharedProvider } from '@/context/SharedContext';

export const metadata: Metadata = {
  title: 'אוטובוט - שירות רישוי רכב',
  description: 'הזמנת שירות רישוי רכב ביתי - בדיקה טכנית וטסט עד הבית',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="font-sans bg-bg min-h-screen">
        <SharedProvider>
          {children}
        </SharedProvider>
      </body>
    </html>
  );
}
