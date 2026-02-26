import { Vehicle } from '@/types';
import { VEHICLE_MAKES, VEHICLE_COLORS } from '@/utils/mockData';

interface Props {
  vehicle: Partial<Vehicle>;
  setVehicle: (v: Partial<Vehicle>) => void;
  errors: Record<string, string>;
}

const years = Array.from({ length: 20 }, (_, i) => 2024 - i);

export default function Step1Vehicle({ vehicle, setVehicle, errors }: Props) {
  const set = (field: keyof Vehicle, value: string | number) =>
    setVehicle({ ...vehicle, [field]: value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">יצרן *</label>
          <select
            value={vehicle.make ?? ''}
            onChange={(e) => set('make', e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">בחר יצרן</option>
            {VEHICLE_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.make && <p className="text-error text-xs mt-1">{errors.make}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">דגם *</label>
          <input
            type="text"
            value={vehicle.model ?? ''}
            onChange={(e) => set('model', e.target.value)}
            placeholder="קורולה"
            className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.model && <p className="text-error text-xs mt-1">{errors.model}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שנה *</label>
          <select
            value={vehicle.year ?? ''}
            onChange={(e) => set('year', parseInt(e.target.value))}
            className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">בחר שנה</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year && <p className="text-error text-xs mt-1">{errors.year}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">צבע *</label>
          <select
            value={vehicle.color ?? ''}
            onChange={(e) => set('color', e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">בחר צבע</option>
            {VEHICLE_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.color && <p className="text-error text-xs mt-1">{errors.color}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">מספר רכב *</label>
        <input
          type="text"
          value={vehicle.licensePlate ?? ''}
          onChange={(e) => set('licensePlate', e.target.value)}
          placeholder="12-345-67"
          maxLength={9}
          className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
          dir="ltr"
        />
        {errors.licensePlate && <p className="text-error text-xs mt-1">{errors.licensePlate}</p>}
      </div>
    </div>
  );
}
