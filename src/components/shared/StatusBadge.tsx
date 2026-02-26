import { ServiceStatus } from '@/types';
import { STATUS_LABELS, STATUS_BG_COLORS } from '@/utils/statusHelpers';
import { cn } from '@/utils/cn';

interface Props {
  status: ServiceStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      STATUS_BG_COLORS[status]
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
