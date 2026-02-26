'use client';
import { Booking, ServiceStatus } from '@/types';
import { getNextStatus, STATUS_LABELS } from '@/utils/statusHelpers';
import { ChevronLeft, X } from 'lucide-react';
import { useShared } from '@/context/SharedContext';

interface Props {
  booking: Booking;
}

export default function OrderStatusStepper({ booking }: Props) {
  const { updateBookingStatus, stopSimulation } = useShared();
  const next = getNextStatus(booking.status);

  const handleAdvance = () => {
    if (!next) return;
    stopSimulation(booking.id);
    updateBookingStatus(booking.id, next);
  };

  const handleFail = (failStatus: ServiceStatus) => {
    stopSimulation(booking.id);
    updateBookingStatus(booking.id, failStatus);
  };

  if (booking.status === 'completed') {
    return (
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="text-success font-bold">השירות הושלם ✓</p>
      </div>
    );
  }

  if (booking.status === 'inspection_failed' || booking.status === 'test_failed') {
    return (
      <div className="bg-red-50 rounded-xl p-4 text-center">
        <p className="text-error font-bold">{STATUS_LABELS[booking.status]}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
        <strong>סטטוס נוכחי:</strong> {STATUS_LABELS[booking.status]}
      </div>

      {next && (
        <button
          onClick={handleAdvance}
          className="w-full py-3 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dark"
        >
          עדכן ל: {STATUS_LABELS[next]}
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Fail options */}
      <div className="flex gap-2">
        {(booking.status === 'inspection_in_progress' || booking.status === 'inspector_en_route') && (
          <button
            onClick={() => handleFail('inspection_failed')}
            className="flex-1 py-2.5 rounded-xl border-2 border-error text-error font-medium text-sm flex items-center justify-center gap-1 hover:bg-red-50"
          >
            <X size={16} />
            בדיקה נכשלה
          </button>
        )}
        {(booking.status === 'test_in_progress' || booking.status === 'at_institute') && (
          <button
            onClick={() => handleFail('test_failed')}
            className="flex-1 py-2.5 rounded-xl border-2 border-error text-error font-medium text-sm flex items-center justify-center gap-1 hover:bg-red-50"
          >
            <X size={16} />
            טסט נכשל
          </button>
        )}
      </div>
    </div>
  );
}
