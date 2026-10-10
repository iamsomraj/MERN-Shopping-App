import { useUpdateProfile, useWishlist } from '@/api/users';
import { FormField } from '@/components/auth/FormField';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageMeta } from '@/hooks/use-page-meta';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heart, Loader2, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name').max(80),
    email: z.email('Enter a valid email'),
    password: z.union([z.literal(''), z.string().min(6, 'Use at least 6 characters')]),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileValues = z.infer<typeof schema>;

function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const { mutate, isPending } = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', password: '', confirmPassword: '' },
  });

  const onSubmit = ({ name, email, password }: ProfileValues) =>
    mutate(
      { name, email, ...(password && { password }) },
      {
        onSuccess: (updated) => {
          toast.success('Profile updated');
          reset({ name: updated.name, email: updated.email, password: '', confirmPassword: '' });
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='max-w-xl space-y-6 rounded-xl border p-6'>
      <div className='grid gap-4 sm:grid-cols-2'>
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
          label='New password'
          type='password'
          autoComplete='new-password'
          placeholder='Leave blank to keep current'
          error={errors.password}
          {...register('password')}
        />
        <FormField
          id='confirmPassword'
          label='Confirm new password'
          type='password'
          autoComplete='new-password'
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </div>
      <Button
        type='submit'
        disabled={isPending || !isDirty}>
        {isPending && <Loader2 className='animate-spin' />} Save changes
      </Button>
    </form>
  );
}

function WishlistTab() {
  const { data, isPending } = useWishlist();
  if (isPending) return <ProductGridSkeleton count={4} />;
  if (!data?.length) {
    return (
      <EmptyState
        icon={Heart}
        title='Your wishlist is empty'
        description='Tap the heart on any product to save it for later.'
        action={
          <Button asChild>
            <Link to='/shop'>Discover products</Link>
          </Button>
        }
      />
    );
  }
  return <ProductGrid products={data} />;
}

export default function AccountPage() {
  usePageMeta('Account', { noindex: true });
  const user = useAuthStore((state) => state.user);
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'wishlist' ? 'wishlist' : 'profile';

  return (
    <div className='container space-y-8 py-8'>
      <PageHeader
        title={`Hi, ${user?.name.split(' ')[0] ?? 'there'}`}
        description='Manage your profile and saved items.'
        actions={
          <Button
            asChild
            variant='outline'>
            <Link to='/orders'>
              <Package /> Your orders
            </Link>
          </Button>
        }
      />
      <Tabs
        value={tab}
        onValueChange={(value) => setParams(value === 'profile' ? {} : { tab: value }, { replace: true })}>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='wishlist'>Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent
          value='profile'
          className='pt-4'>
          <ProfileForm />
        </TabsContent>
        <TabsContent
          value='wishlist'
          className='pt-4'>
          <WishlistTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
