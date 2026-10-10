import { useProductFilters } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { Heart, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useSearchParams } from 'react-router';
import { CartButton } from './CartSheet';
import { Logo } from './Logo';
import { ModeToggle } from './ModeToggle';
import { SearchCommand } from './SearchCommand';
import { UserMenu } from './UserMenu';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
    isActive && 'text-foreground'
  );

function CategoryLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const { data } = useProductFilters();
  const [params] = useSearchParams();
  const active = params.get('category');
  return (
    <nav
      aria-label='Categories'
      className={className}>
      <NavLink
        to='/shop'
        end
        onClick={onNavigate}
        className={({ isActive }) => navLinkClass({ isActive: isActive && !active })}>
        Shop all
      </NavLink>
      {data?.categories.map((category) => (
        <Link
          key={category.name}
          to={`/shop?category=${encodeURIComponent(category.name)}`}
          onClick={onNavigate}
          className={navLinkClass({ isActive: active === category.name })}>
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const close = () => setOpen(false);
  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          aria-label='Open menu'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-72'>
        <SheetHeader>
          <SheetTitle className='sr-only'>Menu</SheetTitle>
          <Logo />
        </SheetHeader>
        <div className='flex flex-col gap-1 px-2'>
          <CategoryLinks
            onNavigate={close}
            className='flex flex-col'
          />
          <Separator className='my-3' />
          <div className='flex items-center justify-between px-3 sm:hidden'>
            <span className='text-sm font-medium text-muted-foreground'>Theme</span>
            <ModeToggle />
          </div>
          {user ? (
            <>
              <NavLink
                to='/account'
                onClick={close}
                className={navLinkClass}>
                Account
              </NavLink>
              <NavLink
                to='/orders'
                onClick={close}
                className={navLinkClass}>
                Orders
              </NavLink>
              {user.isAdmin && (
                <NavLink
                  to='/admin'
                  onClick={close}
                  className={navLinkClass}>
                  Admin dashboard
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink
                to='/login'
                onClick={close}
                className={navLinkClass}>
                Sign in
              </NavLink>
              <NavLink
                to='/register'
                onClick={close}
                className={navLinkClass}>
                Create account
              </NavLink>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center gap-2'>
        <MobileNav />
        <Logo className='mr-4 shrink-0' />
        <CategoryLinks className='hidden items-center lg:flex' />
        <div className='ml-auto flex items-center gap-1'>
          <SearchCommand />
          <Button
            asChild
            variant='ghost'
            size='icon'
            className='hidden sm:inline-flex'>
            <Link
              to='/account?tab=wishlist'
              aria-label='Wishlist'>
              <Heart />
            </Link>
          </Button>
          <CartButton />
          <div className='hidden sm:block'>
            <ModeToggle />
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
