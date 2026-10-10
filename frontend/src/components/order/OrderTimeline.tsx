import { cn, formatDateTime } from '@/lib/utils';
import type { IOrder } from '@/types';
import { CircleX, CreditCard, PackageCheck, ReceiptText, Truck } from 'lucide-react';

export function OrderTimeline({ order }: { order: IOrder }) {
  const steps = [
    { label: 'Order placed', icon: ReceiptText, at: order.createdAt },
    { label: 'Payment confirmed', icon: CreditCard, at: order.paidAt },
    { label: 'Shipped', icon: Truck, at: order.shippedAt },
    { label: 'Delivered', icon: PackageCheck, at: order.deliveredAt },
  ];
  if (order.status === 'cancelled') {
    steps.splice(
      steps.findIndex((step) => !step.at),
      Infinity,
      {
        label: 'Cancelled',
        icon: CircleX,
        at: order.cancelledAt ?? order.updatedAt,
      }
    );
  }
  const currentIndex = steps.findIndex((step) => !step.at);

  return (
    <ol className='relative space-y-6'>
      {steps.map((step, index) => {
        const done = Boolean(step.at);
        const isNext = index === currentIndex;
        const Icon = step.icon;
        return (
          <li
            key={step.label}
            className='relative flex gap-4'>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-9 left-[17px] h-[calc(100%-1rem)] w-0.5',
                  done ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2',
                done && step.label === 'Cancelled' && 'border-muted-foreground bg-muted text-muted-foreground',
                done && step.label !== 'Cancelled' && 'border-primary bg-primary text-primary-foreground',
                !done && isNext && 'border-primary bg-background text-primary',
                !done && !isNext && 'bg-background text-muted-foreground'
              )}>
              <Icon className='size-4' />
            </span>
            <div className='pt-1.5'>
              <p className={cn('text-sm font-medium', !done && 'text-muted-foreground')}>{step.label}</p>
              <p className='text-xs text-muted-foreground'>
                {step.at ? formatDateTime(step.at) : isNext ? 'Up next' : 'Pending'}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
