import { useRegister } from '@/api/users';
import { AuthShell } from '@/components/auth/AuthShell';
import { FormField } from '@/components/auth/FormField';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/use-page-meta';
import { getErrorMessage } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name').max(80),
    email: z.email('Enter a valid email'),
    password: z.string().min(6, 'Use at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof schema>;

export default function RegisterPage() {
  usePageMeta('Create account', { noindex: true });
  const [params] = useSearchParams();
  const { mutate: registerUser, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(schema) });

  const onSubmit = ({ name, email, password }: RegisterValues) =>
    registerUser(
      { name, email, password },
      {
        onSuccess: (user) => toast.success(`Welcome to One Stop EShop, ${user.name.split(' ')[0]}!`),
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    );

  const redirect = params.get('redirect');
  return (
    <AuthShell
      title='Create your account'
      description='Save your wishlist, track orders and check out faster.'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='space-y-4'>
        <FormField
          id='name'
          label='Full name'
          autoComplete='name'
          error={errors.name}
          {...register('name')}
        />
        <FormField
          id='email'
          label='Email'
          type='email'
          autoComplete='email'
          error={errors.email}
          {...register('email')}
        />
        <FormField
          id='password'
          label='Password'
          type='password'
          autoComplete='new-password'
          error={errors.password}
          {...register('password')}
        />
        <FormField
          id='confirmPassword'
          label='Confirm password'
          type='password'
          autoComplete='new-password'
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />
        <Button
          type='submit'
          className='w-full'
          size='lg'
          disabled={isPending}>
          {isPending && <Loader2 className='animate-spin' />} Create account
        </Button>
      </form>
      <p className='text-center text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link
          to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className='font-medium text-primary hover:underline'>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
