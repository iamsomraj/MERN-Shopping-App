import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { initials } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { Heart, LayoutDashboard, LogOut, Package, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        asChild
        variant='ghost'
        size='sm'
        className='max-sm:size-9 max-sm:p-0'>
        <Link
          to='/login'
          aria-label='Sign in'>
          <User className='sm:hidden' />
          <span className='max-sm:sr-only'>Sign in</span>
        </Link>
      </Button>
    );
  }

  const signOut = () => {
    logout();
    toast.success('Signed out. See you soon!');
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full'
          aria-label='Account menu'>
          <Avatar className='size-8'>
            <AvatarFallback className='bg-primary/10 text-xs font-semibold text-primary'>
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-56'>
        <DropdownMenuLabel className='font-normal'>
          <p className='truncate text-sm font-medium'>{user.name}</p>
          <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to='/account'>
            <User /> Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to='/orders'>
            <Package /> Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to='/account?tab=wishlist'>
            <Heart /> Wishlist
          </Link>
        </DropdownMenuItem>
        {user.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to='/admin'>
                <LayoutDashboard /> Admin dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
