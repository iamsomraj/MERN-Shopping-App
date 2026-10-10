import { useImageLibrary } from '@/api/admin';
import { ProductImage } from '@/components/product/ProductImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, Images } from 'lucide-react';
import { useState } from 'react';

export function ImageLibraryDialog({ selected, onPick }: { selected: string[]; onPick: (image: string) => void }) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useImageLibrary();
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='sm'>
          <Images /> Choose from library
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Image library</DialogTitle>
          <DialogDescription>Product photos bundled with the store.</DialogDescription>
        </DialogHeader>
        <div className='grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-5'>
          {isPending
            ? Array.from({ length: 10 }, (_, index) => (
                <Skeleton
                  key={index}
                  className='aspect-square rounded-lg'
                />
              ))
            : data?.map((image) => {
                const isSelected = selected.includes(image);
                return (
                  <button
                    key={image}
                    type='button'
                    disabled={isSelected}
                    onClick={() => {
                      onPick(image);
                      setOpen(false);
                    }}
                    className={cn(
                      'relative overflow-hidden rounded-lg border-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                      isSelected ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    )}
                    aria-label={isSelected ? 'Already added' : `Add ${image.split('/').pop()}`}>
                    <ProductImage
                      src={image}
                      alt=''
                      className='p-2'
                    />
                    {isSelected && (
                      <span className='absolute top-1.5 right-1.5 rounded-full bg-primary p-0.5 text-primary-foreground'>
                        <Check className='size-3' />
                      </span>
                    )}
                  </button>
                );
              })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
