import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ComponentProps } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormFieldProps extends ComponentProps<typeof Input> {
  id: string;
  label: string;
  error?: FieldError;
}

export function FormField({ id, label, error, ...props }: FormFieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          className='text-xs text-destructive'>
          {error.message}
        </p>
      )}
    </div>
  );
}
