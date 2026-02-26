import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  steps: string[];
  current: number;
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center px-4 py-4">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2',
                done ? 'bg-success border-success text-white' :
                active ? 'bg-primary border-primary text-white' :
                'bg-white border-gray-200 text-gray-400'
              )}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn('text-xs mt-1 whitespace-nowrap', active ? 'text-primary font-semibold' : done ? 'text-success' : 'text-gray-400')}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-1 mb-5', done ? 'bg-success' : 'bg-gray-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
