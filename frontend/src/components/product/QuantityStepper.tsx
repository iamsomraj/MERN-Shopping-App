import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'default';
  className?: string;
}

export function QuantityStepper({ value, max, onChange, size = 'default', className }: QuantityStepperProps) {
  const buttonSize = size === 'sm' ? 'icon-xs' : 'icon-sm';
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border',
        size === 'sm' ? 'h-8 gap-0.5 px-0.5' : 'h-10 gap-1 px-1',
        className
      )}>
      <Button
        type='button'
        variant='ghost'
        size={buttonSize}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label='Decrease quantity'>
        <Minus />
      </Button>
      <span
        className={cn('text-center font-medium tabular-nums', size === 'sm' ? 'w-6 text-sm' : 'w-8')}
        aria-live='polite'>
        {value}
      </span>
      <Button
        type='button'
        variant='ghost'
        size={buttonSize}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label='Increase quantity'>
        <Plus />
      </Button>
    </div>
  );
}
