import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { STATUS_LABEL } from '@/lib/order-status';
import type { OrderStatus } from '@/types';

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  paid: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400',
  shipped: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400',
  delivered: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  cancelled: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <Badge
      variant='outline'
      className={cn('gap-1.5 font-medium', STATUS_CLASS[status], className)}>
      <span className='size-1.5 rounded-full bg-current' />
      {STATUS_LABEL[status]}
    </Badge>
  );
}
