import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center',
        className
      )}>
      <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-muted'>
        <Icon className='size-6 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold'>{title}</h3>
      {description && <p className='mt-1 max-w-sm text-sm text-muted-foreground'>{description}</p>}
      {action && <div className='mt-6'>{action}</div>}
    </div>
  );
}
