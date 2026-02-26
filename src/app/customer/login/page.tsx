'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShared } from '@/context/SharedContext';
import { Phone, Lock, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

export default function CustomerLoginPage() {
  const { loginCustomer } = useShared();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.replace(/\D/g, '').length < 9) {
      setError('מספר טלפון לא תקין');
      return;
    }
    if (password.length < 4) {
      setError('סיסמה חייבת להכיל לפחות 4 תווים');
      return;
    }
    setLoading(true);
    const ok = await loginCustomer(phone, password);
    setLoading(false);
    if (ok) router.replace('/customer/home');
    else setError('מספר טלפון או סיסמה שגויים');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #2D5E8E 100%)' }}>
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-4">
          <span className="text-4xl">🚗</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">אוטובוט</h1>
        <p className="text-white/70 text-sm">רישוי רכב עד הבית</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-t-3xl p-6 pb-10 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">כניסה ללקוחות</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מספר טלפון</label>
            <div className="relative">
              <Phone size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-1234567"
                className="w-full border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                className="w-full border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error text-sm bg-red-50 rounded-xl p-3">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'כניסה'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-600">
          <strong>לדמו:</strong> כל מספר טלפון (9+ ספרות) + כל סיסמה (4+ תווים)
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            ספק שירות?{' '}
            <Link href="/provider/login" className="text-primary font-semibold hover:underline">
              כניסה לממשק הניהול
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
