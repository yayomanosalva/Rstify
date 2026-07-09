import { cn } from '@/shared/lib/util';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({ fullScreen, className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen && 'fixed inset-0 bg-background/80 z-50',
        className,
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
