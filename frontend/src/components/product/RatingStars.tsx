import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  className?: string;
  starClassName?: string;
}

/** Read-only star rating with partial fill for fractional values. */
export function RatingStars({ rating, className, starClassName }: RatingStarsProps) {
  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role='img'
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(0, Math.min(1, rating - index));
        return (
          <span
            key={index}
            className='relative inline-flex'>
            <Star className={cn('size-3.5 fill-current text-muted-foreground/30', starClassName)} />
            {fill > 0 && (
              <span
                className='absolute inset-0 overflow-hidden'
                style={{ width: `${fill * 100}%` }}>
                <Star className={cn('size-3.5 fill-current text-warning', starClassName)} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

const LABELS = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

export function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <div
      className='flex items-center gap-1'
      role='radiogroup'
      aria-label='Rating'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          role='radio'
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''} — ${LABELS[star - 1]}`}
          onClick={() => onChange(star)}
          className='rounded-sm p-0.5 transition-transform outline-none hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/50'>
          <Star className={cn('size-6 fill-current', star <= value ? 'text-warning' : 'text-muted-foreground/30')} />
        </button>
      ))}
      {value > 0 && <span className='ml-2 text-sm text-muted-foreground'>{LABELS[value - 1]}</span>}
    </div>
  );
}
