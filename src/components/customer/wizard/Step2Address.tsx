'use client';

import { Address } from '@/types';
import { CITIES } from '@/utils/mockData';
import { MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Props {
  address: Partial<Address>;
  setAddress: (a: Partial<Address>) => void;
  errors: Record<string, string>;
}

export default function Step2Address({ address, setAddress, errors }: Props) {
  const set = (field: keyof Address, value: string) =>
    setAddress({ ...address, [field]: value });

  const [query, setQuery] = useState(address.city ?? '');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 0
    ? CITIES.filter(c => c.startsWith(query)).slice(0, 8)
    : [];

  const select = (city: string) => {
    set('city', city);
    setQuery(city);
    setOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">עיר *</label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            set('city', '');
            setOpen(true);
          }}
          onFocus={() => query.length > 0 && setOpen(true)}
          placeholder="הקלד שם ישוב..."
          className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
          autoComplete="off"
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-56 overflow-auto">
            {filtered.map(city => (
              <li
                key={city}
                onMouseDown={() => select(city)}
                className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-gray-900 text-sm"
              >
                {city}
              </li>
            ))}
          </ul>
        )}
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
