import { useToggleWishlist, useWishlistIds } from '@/api/users';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import type { IProduct } from '@/types';
import { Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

interface WishlistButtonProps {
  product: IProduct;
  variant?: 'icon' | 'full';
  className?: string;
}

export function WishlistButton({ product, variant = 'icon', className }: WishlistButtonProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const savedIds = useWishlistIds();
  const { mutate } = useToggleWishlist();
  const saved = savedIds.has(product._id);

  const toggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      toast('Sign in to save items to your wishlist');
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    mutate(
      { product, saved },
      {
        onSuccess: () => toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist'),
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    );
  };

  const label = saved ? 'Remove from wishlist' : 'Save to wishlist';
  const icon = <Heart className={cn('transition-colors', saved && 'fill-rose-500 text-rose-500')} />;

  if (variant === 'full') {
    return (
      <Button
        type='button'
        variant='outline'
        size='lg'
        onClick={toggle}
        aria-pressed={saved}
        className={className}>
        {icon}
        {saved ? 'Saved' : 'Save'}
      </Button>
    );
  }

  return (
    <Button
      type='button'
      variant='secondary'
      size='icon-sm'
      onClick={toggle}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={cn('rounded-full bg-background/80 shadow-sm backdrop-blur hover:bg-background', className)}>
      {icon}
    </Button>
  );
}
