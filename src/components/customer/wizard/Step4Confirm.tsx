import { Vehicle, Address } from '@/types';
import { formatPrice } from '@/utils/statusHelpers';
import { Car, MapPin, Calendar, Banknote } from 'lucide-react';

interface Props {
  vehicle: Partial<Vehicle>;
  address: Partial<Address>;
  date: string;
  time: string;
  notes: string;
}

export default function Step4Confirm({ vehicle, address, date, time, notes }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
        <Row icon={<Car size={18} className="text-primary" />} label="רכב">
          <span>{vehicle.make} {vehicle.model} {vehicle.year}</span>
          <span className="text-gray-500 text-xs">{vehicle.color} • {vehicle.licensePlate}</span>
        </Row>
        <Row icon={<MapPin size={18} className="text-primary" />} label="כתובת">
          <span>{address.street} {address.houseNumber}{address.apartment ? ` דירה ${address.apartment}` : ''}</span>
          <span className="text-gray-500 text-xs">{address.city}</span>
        </Row>
        <Row icon={<Calendar size={18} className="text-primary" />} label="מועד">
          <span>{new Date(date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <span className="text-gray-500 text-xs">{time}</span>
        </Row>
        <Row icon={<Banknote size={18} className="text-primary" />} label="מחיר">
          <span className="text-xl font-black text-primary">{formatPrice(299)}</span>
          <span className="text-gray-500 text-xs">תשלום בסיום השירות</span>
        </Row>
      </div>
      {notes && (
        <div className="bg-yellow-50 rounded-xl p-3 text-sm text-yellow-800">
          <strong>הערות:</strong> {notes}
        </div>
      )}
      <p className="text-xs text-gray-500 text-center">
        בלחיצה על &quot;הזמן&quot; אתה מסכים לתנאי השירות. ניתן לבטל עד 2 שעות לפני הגעת הבוחן.
      </p>
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <div className="flex flex-col gap-0.5">{children}</div>
      </div>
    </div>
  );
}
