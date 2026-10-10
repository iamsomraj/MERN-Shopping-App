import { useProductFilters } from '@/api/products';
import { Link } from 'react-router';
import { Logo } from './Logo';

const linkClass = 'text-muted-foreground hover:text-foreground text-sm transition-colors';

export function SiteFooter() {
  const { data } = useProductFilters();
  return (
    <footer className='mt-24 border-t bg-muted/30'>
      <div className='container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='space-y-3 lg:col-span-2'>
          <Logo />
          <p className='max-w-sm text-sm text-muted-foreground'>
            Everything you love, in one place. Thoughtfully picked electronics, fashion, jewelry and everyday essentials
            — delivered fast.
          </p>
        </div>
        <div className='space-y-3'>
          <h2 className='text-sm font-semibold'>Shop</h2>
          <ul className='space-y-2'>
            <li>
              <Link
                to='/shop'
                className={linkClass}>
                All products
              </Link>
            </li>
            {data?.categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className={linkClass}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='space-y-3'>
          <h2 className='text-sm font-semibold'>Account</h2>
          <ul className='space-y-2'>
            <li>
              <Link
                to='/account'
                className={linkClass}>
                My account
              </Link>
            </li>
            <li>
              <Link
                to='/orders'
                className={linkClass}>
                Orders
              </Link>
            </li>
            <li>
              <Link
                to='/account?tab=wishlist'
                className={linkClass}>
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                to='/cart'
                className={linkClass}>
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className='border-t'>
        <div className='container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between'>
          <p>© {new Date().getFullYear()} One Stop EShop. A MERN stack demo store.</p>
          <a
            href='https://github.com/iamsomraj/MERN-Shopping-App'
            target='_blank'
            rel='noreferrer'
            className='hover:text-foreground'>
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
