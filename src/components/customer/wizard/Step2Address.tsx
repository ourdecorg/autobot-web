import { Address } from '@/types';
import { CITIES } from '@/utils/mockData';
import { MapPin } from 'lucide-react';

interface Props {
  address: Partial<Address>;
  setAddress: (a: Partial<Address>) => void;
  errors: Record<string, string>;
}

export default function Step2Address({ address, setAddress, errors }: Props) {
  const set = (field: keyof Address, value: string) =>
    setAddress({ ...address, [field]: value });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">עיר *</label>
        <select
          value={address.city ?? ''}
          onChange={(e) => set('city', e.target.value)}
          className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">בחר עיר</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.city && <p className="text-error text-xs mt-1">{errors.city}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">רחוב *</label>
          <input
            type="text"
            value={address.street ?? ''}
            onChange={(e) => set('street', e.target.value)}
            placeholder="דיזנגוף"
            className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.street && <p className="text-error text-xs mt-1">{errors.street}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">מספר *</label>
          <input
            type="text"
            value={address.houseNumber ?? ''}
            onChange={(e) => set('houseNumber', e.target.value)}
            placeholder="50"
            className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.houseNumber && <p className="text-error text-xs mt-1">{errors.houseNumber}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">דירה (אופציונלי)</label>
        <input
          type="text"
          value={address.apartment ?? ''}
          onChange={(e) => set('apartment', e.target.value)}
          placeholder="4"
          className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      {address.street && address.houseNumber && address.city && (
        <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 text-blue-700 text-sm">
          <MapPin size={16} className="flex-shrink-0" />
          <span>{address.street} {address.houseNumber}{address.apartment ? ` דירה ${address.apartment}` : ''}, {address.city}</span>
        </div>
      )}
    </div>
  );
}
