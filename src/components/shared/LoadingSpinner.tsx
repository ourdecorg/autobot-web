import { cn } from '@/utils/cn';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: Props) {
  const sizeClasses = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'rounded-full border-primary/30 border-t-primary animate-spin',
        sizeClasses[size]
      )} style={{ borderWidth: size === 'sm' ? 2 : size === 'md' ? 3 : 4 }} />
    </div>
  );
}
