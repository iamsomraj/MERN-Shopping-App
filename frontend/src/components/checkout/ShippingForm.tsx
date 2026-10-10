import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IShippingAddress } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(80),
  address: z.string().trim().min(2, 'Enter your street address').max(160),
  city: z.string().trim().min(2, 'Enter your city').max(80),
  postalCode: z.string().trim().min(3, 'Enter a valid postal code').max(12),
  country: z.string().trim().min(2, 'Enter your country').max(60),
  phone: z.string().trim().max(20).optional(),
});

interface ShippingFormProps {
  defaultValues: Partial<IShippingAddress>;
  onSubmit: (address: IShippingAddress) => void;
}

const FIELDS: Array<{ name: keyof IShippingAddress; label: string; autoComplete: string; className?: string }> = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name', className: 'sm:col-span-2' },
  { name: 'address', label: 'Street address', autoComplete: 'street-address', className: 'sm:col-span-2' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', autoComplete: 'country-name' },
  { name: 'phone', label: 'Phone (optional)', autoComplete: 'tel' },
];

export function ShippingForm({ defaultValues, onSubmit }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IShippingAddress>({ resolver: zodResolver(schema), defaultValues });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='space-y-6'>
      <div className='grid gap-4 sm:grid-cols-2'>
        {FIELDS.map((field) => (
          <div
            key={field.name}
            className={`space-y-2 ${field.className ?? ''}`}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              autoComplete={field.autoComplete}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                className='text-xs text-destructive'>
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
      <Button
        type='submit'
        size='lg'
        className='w-full sm:w-auto'>
        Continue to review <ArrowRight />
      </Button>
    </form>
  );
}
