import dynamic from 'next/dynamic';
import { Booking } from '@/types';

const TrackingMapInner = dynamic(() => import('./TrackingMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-200 animate-pulse rounded-2xl flex items-center justify-center">
      <span className="text-slate-400 text-sm">טוען מפה...</span>
    </div>
  ),
});

interface Props {
  booking: Booking;
}

export default function TrackingMap({ booking }: Props) {
  return <TrackingMapInner booking={booking} />;
}
