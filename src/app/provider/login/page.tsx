'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import { Mail, Lock, AlertCircle, Settings2 } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

export default function ProviderLoginPage() {
  const { loginProvider } = useShared();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await loginProvider(email, password);
    setLoading(false);
    if (ok) router.replace('/provider/dashboard');
    else setError('פרטי כניסה שגויים');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">ממשק ניהול</h1>
          <p className="text-gray-500 text-sm">כניסה לצוות אוטובוט</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
              <div className="relative">
                <Mail size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autobot.co.il"
                  className="w-full border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
              <div className="relative">
                <Lock size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-error text-sm bg-red-50 rounded-xl p-3">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <LoadingSpinner size="sm" /> : 'כניסה'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-600">
            <strong>לדמו:</strong> admin@autobot.co.il / admin123
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          לקוח?{' '}
          <Link href="/customer/login" className="text-primary font-semibold hover:underline">כניסה ללקוחות</Link>
        </p>
      </div>
    </div>
  );
}
