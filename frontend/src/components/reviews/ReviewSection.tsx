import { productKeys, useCreateReview, useProductReviews } from '@/api/products';
import { PaginationNav } from '@/components/common/PaginationNav';
import { RatingInput, RatingStars } from '@/components/product/RatingStars';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ApiError, getErrorMessage } from '@/lib/api';
import { formatDate, initials } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import type { IProduct } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, MessageSquareText, TriangleAlert } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { toast } from 'sonner';

function ReviewForm({ productId, onDone }: { productId: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const { mutate, isPending } = useCreateReview(productId);
  const queryClient = useQueryClient();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) {
      toast.error('Please choose a star rating');
      return;
    }
    mutate(
      { rating, title, comment },
      {
        onSuccess: () => {
          toast.success('Thanks for your review!');
          onDone();
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 404) {
            // Stale product data: reload it; the form keeps what was typed so it can be resubmitted.
            void queryClient.invalidateQueries({ queryKey: productKeys.all });
            toast.error('This product was just updated. Please submit your review again.');
            return;
          }
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  return (
    <form
      onSubmit={submit}
      className='space-y-4 rounded-xl border bg-muted/30 p-5'>
      <div className='space-y-2'>
        <Label>Your rating</Label>
        <RatingInput
          value={rating}
          onChange={setRating}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='review-title'>Title (optional)</Label>
        <Input
          id='review-title'
          value={title}
          maxLength={100}
          onChange={(event) => setTitle(event.target.value)}
          placeholder='Sum it up in a few words'
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='review-comment'>Review</Label>
        <Textarea
          id='review-comment'
          required
          minLength={3}
          maxLength={1000}
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder='What did you like or dislike?'
        />
      </div>
      <div className='flex gap-2'>
        <Button
          type='submit'
          disabled={isPending}>
          {isPending ? 'Posting…' : 'Post review'}
        </Button>
        <Button
          type='button'
          variant='ghost'
          onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ReviewSection({ product }: { product: IProduct }) {
  const [page, setPage] = useState(1);
  const [writing, setWriting] = useState(false);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data, isPending, error } = useProductReviews(product._id, page);
  const alreadyReviewed = Boolean(user && data?.viewerHasReviewed);
  const refreshProduct = useCallback(() => queryClient.invalidateQueries({ queryKey: productKeys.all }), [queryClient]);

  // A 404 means the cached product is stale (e.g. the catalog was replaced): reload it by slug,
  // which also refetches reviews under its current id.
  useEffect(() => {
    if (error instanceof ApiError && error.status === 404) void refreshProduct();
  }, [error, refreshProduct]);

  return (
    <section
      id='reviews'
      className='scroll-mt-24 space-y-8'>
      <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>Customer reviews</h2>
      <div className='grid gap-10 lg:grid-cols-[18rem_1fr]'>
        <div className='space-y-5'>
          <div className='flex items-center gap-4'>
            <p className='text-5xl font-semibold tracking-tight tabular-nums'>
              {product.numReviews ? product.rating.toFixed(1) : '–'}
            </p>
            <div className='space-y-1'>
              <RatingStars
                rating={product.rating}
                starClassName='size-4'
              />
              <p className='text-sm text-muted-foreground'>
                {product.numReviews} review{product.numReviews === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          {data && (
            <ul className='space-y-2'>
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = data.distribution[star] ?? 0;
                return (
                  <li
                    key={star}
                    className='flex items-center gap-3 text-sm'>
                    <span className='w-10 text-muted-foreground tabular-nums'>{star} star</span>
                    <Progress
                      value={data.total ? (count / data.total) * 100 : 0}
                      className='h-2 flex-1 bg-muted [&>*]:bg-amber-400'
                      aria-label={`${count} ${star}-star reviews`}
                    />
                    <span className='w-6 text-right text-muted-foreground tabular-nums'>{count}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {!user ? (
            <Button
              asChild
              variant='outline'
              className='w-full'>
              <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`}>Sign in to write a review</Link>
            </Button>
          ) : alreadyReviewed ? (
            <p className='text-sm text-muted-foreground'>Thanks — you have reviewed this product.</p>
          ) : (
            !writing && (
              <Button
                variant='outline'
                className='w-full'
                onClick={() => setWriting(true)}>
                Write a review
              </Button>
            )
          )}
        </div>

        <div className='space-y-6'>
          {writing && (
            <ReviewForm
              productId={product._id}
              onDone={() => setWriting(false)}
            />
          )}
          {error ? (
            <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground'>
              <TriangleAlert className='size-6' />
              Reviews couldn&apos;t be loaded.
              <Button
                variant='outline'
                size='sm'
                onClick={refreshProduct}>
                Try again
              </Button>
            </div>
          ) : isPending ? (
            Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className='space-y-2'>
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-16 w-full' />
              </div>
            ))
          ) : data?.reviews.length ? (
            <>
              <ul className='divide-y'>
                {data.reviews.map((review) => (
                  <li
                    key={review._id}
                    className='space-y-3 py-6 first:pt-0'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-9'>
                        <AvatarFallback className='text-xs'>{initials(review.name)}</AvatarFallback>
                      </Avatar>
                      <div className='min-w-0'>
                        <p className='text-sm font-medium'>{review.name}</p>
                        <p className='text-xs text-muted-foreground'>{formatDate(review.createdAt)}</p>
                      </div>
                      {review.isVerifiedPurchase && (
                        <Badge
                          variant='outline'
                          className='ml-auto gap-1 text-success'>
                          <BadgeCheck className='size-3.5' /> Verified purchase
                        </Badge>
                      )}
                    </div>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <RatingStars rating={review.rating} />
                        {review.title && <p className='text-sm font-semibold'>{review.title}</p>}
                      </div>
                      <p className='text-sm leading-relaxed text-muted-foreground'>{review.comment}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <PaginationNav
                page={data.page}
                pages={data.pages}
                onPageChange={setPage}
              />
            </>
          ) : (
            !writing && (
              <div className='flex flex-col items-center gap-2 rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground'>
                <MessageSquareText className='size-6' />
                No reviews yet. Be the first to share your thoughts!
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
