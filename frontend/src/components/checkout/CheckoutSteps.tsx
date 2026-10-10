import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = ['Shipping', 'Review', 'Payment'];

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol
      className='flex items-center gap-2 text-sm'
      aria-label='Checkout progress'>
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step}
            className='flex items-center gap-2'
            aria-current={active ? 'step' : undefined}>
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                done && 'border-primary bg-primary text-primary-foreground',
                active && 'border-primary text-primary',
                !done && !active && 'text-muted-foreground'
              )}>
              {done ? <Check className='size-3.5' /> : index + 1}
            </span>
            <span className={cn('hidden font-medium sm:inline', !active && !done && 'text-muted-foreground')}>
              {step}
            </span>
            {index < STEPS.length - 1 && <span className='mx-1 h-px w-6 bg-border sm:mx-2 sm:w-12' />}
          </li>
        );
      })}
    </ol>
  );
}
