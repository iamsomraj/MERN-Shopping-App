import { cn } from '@/lib/utils';
import type { IShippingAddress } from '@/types';

export function AddressBlock({ address, className }: { address: IShippingAddress; className?: string }) {
  const lines = [
    address.fullName,
    address.address,
    `${address.city}, ${address.postalCode}`,
    address.country,
    address.phone,
  ].filter(Boolean);
  return (
    <address className={cn('text-sm leading-relaxed text-muted-foreground not-italic', className)}>
      {lines.map((line) => (
        <span
          key={line}
          className='block'>
          {line}
        </span>
      ))}
    </address>
  );
}
