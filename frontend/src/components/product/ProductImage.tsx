import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import { type ImgHTMLAttributes, useState } from 'react';

interface ProductImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Eagerly load above-the-fold images (hero, main product photo). */
  priority?: boolean;
  /** Classes for the square tile wrapping the image. */
  tileClassName?: string;
}

/** A square, light tile with the product photo centered inside (photos have white backgrounds). */
export function ProductImage({ src, alt, priority, className, tileClassName, ...props }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn('relative aspect-square overflow-hidden bg-product-tile', tileClassName)}>
      {failed ? (
        <div className='flex size-full items-center justify-center text-muted-foreground'>
          <ImageOff className='size-6' />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={800}
          height={800}
          loading={priority ? 'eager' : 'lazy'}
          decoding='async'
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          className={cn('size-full object-contain p-[12%] mix-blend-multiply', className)}
          {...props}
        />
      )}
    </div>
  );
}
