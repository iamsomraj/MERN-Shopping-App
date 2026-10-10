import { type ProductInput, useSaveProduct } from '@/api/admin';
import { useProduct, useProductFilters } from '@/api/products';
import { ImageLibraryDialog } from '@/components/admin/ImageLibraryDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductImage } from '@/components/product/ProductImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { usePageMeta } from '@/hooks/use-page-meta';
import { getErrorMessage } from '@/lib/api';
import type { IProduct } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Link2, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const optionalNumber = z.preprocess(
  (value) => (value === '' || value === null || Number.isNaN(value) ? null : value),
  z.coerce.number().positive('Must be greater than 0').nullable()
);

const schema = z
  .object({
    name: z.string().trim().min(2, 'Enter a product name').max(120),
    description: z.string().trim().max(2000),
    category: z.string().trim().min(2, 'Enter a category').max(40),
    brand: z.string().trim().max(60),
    price: z.coerce.number('Enter a price').nonnegative('Price cannot be negative'),
    compareAtPrice: optionalNumber,
    qtyInStock: z.coerce.number('Enter the stock').int('Use a whole number').nonnegative(),
    images: z.array(z.string()).min(1, 'Add at least one image').max(8),
    isFeatured: z.boolean(),
    isAvailable: z.boolean(),
  })
  .refine((values) => values.compareAtPrice == null || values.compareAtPrice > values.price, {
    message: 'Must be higher than the price',
    path: ['compareAtPrice'],
  });

type FormInput = z.input<typeof schema>;

const EMPTY: FormInput = {
  name: '',
  description: '',
  category: '',
  brand: '',
  price: '' as unknown as number,
  compareAtPrice: null,
  qtyInStock: 10,
  images: [],
  isFeatured: false,
  isAvailable: true,
};

const toFormValues = (product: IProduct): FormInput => ({
  name: product.name,
  description: product.description,
  category: product.category,
  brand: product.brand,
  price: product.price,
  compareAtPrice: product.compareAtPrice ?? null,
  qtyInStock: product.qtyInStock,
  images: product.images.length ? product.images : [product.image],
  isFeatured: product.isFeatured,
  isAvailable: product.isAvailable,
});

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: { message?: string };
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className='text-xs text-destructive'>{error.message}</p>
      ) : (
        hint && <p className='text-xs text-muted-foreground'>{hint}</p>
      )}
    </div>
  );
}

function ProductForm({ product }: { product?: IProduct }) {
  const navigate = useNavigate();
  const { data: filters } = useProductFilters();
  const { mutate: save, isPending } = useSaveProduct(product?._id);
  const [imageUrl, setImageUrl] = useState('');
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormInput, unknown, ProductInput>({
    resolver: zodResolver(schema) as never,
    defaultValues: product ? toFormValues(product) : EMPTY,
  });

  const values = useWatch({ control }) as FormInput;
  const images = values.images;

  const addImage = (image: string) => {
    if (!image || images.includes(image)) return;
    setValue('images', [...images, image], { shouldDirty: true, shouldValidate: true });
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!/^https?:\/\/\S+$/.test(url)) {
      toast.error('Enter a full image URL starting with http(s)://');
      return;
    }
    addImage(url);
    setImageUrl('');
  };

  const onSubmit = (data: ProductInput) =>
    save(data, {
      onSuccess: (saved) => {
        toast.success(product ? 'Product updated' : 'Product created');
        navigate(product ? '/admin/products' : `/admin/products/${saved._id}/edit`, { replace: !product });
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const preview = {
    _id: product?._id ?? 'preview',
    slug: product?.slug ?? '',
    name: values.name || 'Product name',
    description: values.description,
    category: values.category || 'Category',
    brand: values.brand,
    image: images[0] ?? '',
    images,
    price: Number(values.price) || 0,
    compareAtPrice: Number(values.compareAtPrice) || null,
    qtyInStock: Number(values.qtyInStock) || 0,
    isAvailable: values.isAvailable,
    isFeatured: values.isFeatured,
    rating: product?.rating ?? 0,
    numReviews: product?.numReviews ?? 0,
    createdAt: '',
    updatedAt: '',
  } satisfies IProduct;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='grid gap-6 xl:grid-cols-[1fr_20rem]'>
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <Field
                id='name'
                label='Name'
                error={errors.name}>
                <Input
                  id='name'
                  aria-invalid={Boolean(errors.name)}
                  {...register('name')}
                />
              </Field>
            </div>
            <div className='sm:col-span-2'>
              <Field
                id='description'
                label='Description'
                error={errors.description}>
                <Textarea
                  id='description'
                  rows={5}
                  {...register('description')}
                />
              </Field>
            </div>
            <Field
              id='category'
              label='Category'
              error={errors.category}
              hint='Pick an existing category or type a new one'>
              <Input
                id='category'
                list='category-options'
                aria-invalid={Boolean(errors.category)}
                {...register('category')}
              />
              <datalist id='category-options'>
                {filters?.categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                  />
                ))}
              </datalist>
            </Field>
            <Field
              id='brand'
              label='Brand'
              error={errors.brand}>
              <Input
                id='brand'
                list='brand-options'
                {...register('brand')}
              />
              <datalist id='brand-options'>
                {filters?.brands.map((brand) => (
                  <option
                    key={brand}
                    value={brand}
                  />
                ))}
              </datalist>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>The first image is used on product cards.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {images.length > 0 && (
              <ul className='grid grid-cols-3 gap-3 sm:grid-cols-5'>
                {images.map((image, index) => (
                  <li
                    key={image}
                    className='group relative'>
                    <ProductImage
                      src={image}
                      alt=''
                      tileClassName='rounded-lg border'
                      className='p-2'
                    />
                    {index === 0 && (
                      <span className='absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground'>
                        Cover
                      </span>
                    )}
                    <Button
                      type='button'
                      variant='secondary'
                      size='icon-xs'
                      className='absolute top-1.5 right-1.5'
                      onClick={() =>
                        setValue(
                          'images',
                          images.filter((item) => item !== image),
                          { shouldDirty: true, shouldValidate: true }
                        )
                      }
                      aria-label='Remove image'>
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className='flex flex-col gap-2 sm:flex-row'>
              <div className='relative flex-1'>
                <Link2 className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addImageUrl();
                    }
                  }}
                  placeholder='https://example.com/photo.jpg'
                  className='pl-9'
                  aria-label='Image URL'
                />
              </div>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                className='h-9'
                onClick={addImageUrl}>
                Add URL
              </Button>
              <ImageLibraryDialog
                selected={images}
                onPick={addImage}
              />
            </div>
            {errors.images && <p className='text-xs text-destructive'>{errors.images.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & inventory</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-3'>
            <Field
              id='price'
              label='Price (USD)'
              error={errors.price}>
              <Input
                id='price'
                type='number'
                step='0.01'
                min='0'
                aria-invalid={Boolean(errors.price)}
                {...register('price')}
              />
            </Field>
            <Field
              id='compareAtPrice'
              label='Compare-at price'
              error={errors.compareAtPrice}
              hint='Shown struck through when on sale'>
              <Input
                id='compareAtPrice'
                type='number'
                step='0.01'
                min='0'
                aria-invalid={Boolean(errors.compareAtPrice)}
                {...register('compareAtPrice')}
              />
            </Field>
            <Field
              id='qtyInStock'
              label='Stock'
              error={errors.qtyInStock}>
              <Input
                id='qtyInStock'
                type='number'
                step='1'
                min='0'
                aria-invalid={Boolean(errors.qtyInStock)}
                {...register('qtyInStock')}
              />
            </Field>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Controller
              control={control}
              name='isAvailable'
              render={({ field }) => (
                <div className='flex items-center justify-between gap-4'>
                  <Label htmlFor='isAvailable'>
                    <span className='grid gap-1'>
                      Visible in store
                      <span className='text-xs font-normal text-muted-foreground'>Hidden products can’t be bought</span>
                    </span>
                  </Label>
                  <Switch
                    id='isAvailable'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name='isFeatured'
              render={({ field }) => (
                <div className='flex items-center justify-between gap-4'>
                  <Label htmlFor='isFeatured'>
                    <span className='grid gap-1'>
                      Featured
                      <span className='text-xs font-normal text-muted-foreground'>Shown on the home page</span>
                    </span>
                  </Label>
                  <Switch
                    id='isFeatured'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className='pointer-events-none'>
            <ProductCard product={preview} />
          </CardContent>
        </Card>
        <div className='flex gap-2'>
          <Button
            type='submit'
            className='flex-1'
            disabled={isPending || (Boolean(product) && !isDirty)}>
            {isPending && <Loader2 className='animate-spin' />}
            {product ? 'Save changes' : 'Create product'}
          </Button>
          <Button
            asChild
            variant='outline'>
            <Link to='/admin/products'>Cancel</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function ProductFormPage() {
  const { id } = useParams();
  const { data: product, isPending, error, refetch } = useProduct(id ?? '');
  usePageMeta(id ? 'Edit product · Admin' : 'New product · Admin', { noindex: true });

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='-ml-3'>
          <Link to='/admin/products'>
            <ArrowLeft /> Products
          </Link>
        </Button>
        <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
          {id ? (product?.name ?? 'Edit product') : 'New product'}
        </h1>
      </div>
      {!id ? (
        <ProductForm />
      ) : isPending ? (
        <Skeleton className='h-96 rounded-xl' />
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={() => refetch()}
        />
      ) : (
        <ProductForm
          key={product._id}
          product={product}
        />
      )}
    </div>
  );
}
