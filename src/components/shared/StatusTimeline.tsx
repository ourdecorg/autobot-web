import { ServiceStatus } from '@/types';
import { getStatusSteps } from '@/utils/statusHelpers';
import { Check, X, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  status: ServiceStatus;
  compact?: boolean;
}

export default function StatusTimeline({ status, compact = false }: Props) {
  const steps = getStatusSteps(status);

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={step.status} className="flex items-start gap-3">
            {/* Line + Icon */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2',
                step.completed
                  ? 'bg-success border-success text-white'
                  : step.active
                  ? 'bg-primary border-primary text-white'
                  : step.failed
                  ? 'bg-error border-error text-white'
                  : 'bg-white border-gray-200 text-gray-400'
              )}>
                {step.completed ? (
                  <Check size={14} />
                ) : step.failed ? (
                  <X size={14} />
                ) : step.active ? (
                  <Clock size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              {!isLast && (
                <div className={cn(
                  'w-0.5 flex-1 min-h-6',
                  step.completed ? 'bg-success' : 'bg-gray-200'
                )} />
              )}
            </div>

            {/* Label */}
            <div className={cn('pb-4', isLast && 'pb-0')}>
              <p className={cn(
                'text-sm font-medium mt-1',
                step.completed ? 'text-success' : step.active ? 'text-primary' : step.failed ? 'text-error' : 'text-gray-400'
              )}>
                {step.label}
              </p>
              {step.active && !compact && (
                <p className="text-xs text-gray-500 mt-0.5">בתהליך...</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
