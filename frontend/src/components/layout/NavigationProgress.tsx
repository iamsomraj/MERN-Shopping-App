import { cn } from '@/lib/utils';
import { useNavigation } from 'react-router';

/** Thin bar at the top of the page while a lazy route is loading. */
export function NavigationProgress() {
  const { state } = useNavigation();
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary transition-all duration-500',
        state === 'loading' ? 'scale-x-75 opacity-100' : 'scale-x-100 opacity-0'
      )}
    />
  );
}
