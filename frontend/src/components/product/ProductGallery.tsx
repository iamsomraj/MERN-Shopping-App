import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ProductImage } from './ProductImage';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? '';

  return (
    <div className='flex flex-col gap-3 md:flex-row-reverse'>
      <ProductImage
        key={current}
        src={current}
        alt={name}
        priority
        tileClassName='animate-in fade-in flex-1 rounded-2xl border duration-300'
        className='p-[10%]'
      />
      {images.length > 1 && (
        <div
          className='flex gap-3 md:flex-col'
          role='tablist'
          aria-label='Product images'>
          {images.map((image, index) => (
            <button
              key={image}
              type='button'
              role='tab'
              aria-selected={index === active}
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                'w-16 overflow-hidden rounded-lg border-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-20',
                index === active ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              )}>
              <ProductImage
                src={image}
                alt=''
                className='p-1.5'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
