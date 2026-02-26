import { Booking } from '@/types';
import { formatShortDate, formatPrice } from '@/utils/statusHelpers';
import StatusBadge from './StatusBadge';
import { MapPin, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  booking: Booking;
  onClick?: () => void;
  className?: string;
}

export default function BookingCard({ booking, onClick, className }: Props) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border border-gray-100',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-gray-900">
            {booking.vehicle.make} {booking.vehicle.model}
          </p>
          <p className="text-sm text-gray-500">{booking.vehicle.licensePlate}</p>
        </div>
        <StatusBadge status={booking.status} size="sm" />
      </div>
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <span>{booking.address.street} {booking.address.houseNumber}, {booking.address.city}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400 flex-shrink-0" />
          <span>{formatShortDate(booking.scheduledDate)} • {booking.scheduledTime}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">#{booking.id}</span>
        <span className="font-bold text-sm text-primary">{formatPrice(booking.price)}</span>
      </div>
    </div>
  );
}
