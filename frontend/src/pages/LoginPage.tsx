import { useLogin } from '@/api/users';
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

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

type LoginValues = z.infer<typeof schema>;

const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'john@example.com' },
  { label: 'Admin', email: 'admin@example.com' },
];

export default function LoginPage() {
  usePageMeta('Sign in', { noindex: true });
  const [params] = useSearchParams();
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  // GuestOnly redirects once the user is stored, honouring ?redirect=.
  const onSubmit = (values: LoginValues) =>
    login(values, {
      onSuccess: (user) => toast.success(`Welcome back, ${user.name.split(' ')[0]}!`),
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const redirect = params.get('redirect');
  return (
    <AuthShell
      title='Welcome back'
      description='Sign in to your account to continue.'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='space-y-4'>
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
          autoComplete='current-password'
          error={errors.password}
          {...register('password')}
        />
        <Button
          type='submit'
          className='w-full'
          size='lg'
          disabled={isPending}>
          {isPending && <Loader2 className='animate-spin' />} Sign in
        </Button>
      </form>
      <div className='space-y-3 rounded-xl border border-dashed bg-muted/50 p-4'>
        <p className='text-xs text-muted-foreground'>
          Exploring the demo? Use a sample account (password <code className='text-foreground'>123456</code>).
        </p>
        <div className='grid grid-cols-2 gap-2'>
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.email}
              type='button'
              variant='outline'
              size='sm'
              onClick={() => {
                setValue('email', account.email, { shouldValidate: true });
                setValue('password', '123456', { shouldValidate: true });
              }}>
              {account.label}
            </Button>
          ))}
        </div>
      </div>
      <p className='text-center text-sm text-muted-foreground'>
        New here?{' '}
        <Link
          to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className='font-medium text-primary hover:underline'>
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
