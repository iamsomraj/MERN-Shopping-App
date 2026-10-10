import { CartSheet } from '@/components/layout/CartSheet';
import { NavigationProgress } from '@/components/layout/NavigationProgress';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Outlet, ScrollRestoration } from 'react-router';

export default function StorefrontLayout() {
  return (
    <>
      <NavigationProgress />
      <a
        href='#main'
        className='sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3'>
        Skip to content
      </a>
      <SiteHeader />
      <main
        id='main'
        className='flex-1'>
        <Outlet />
      </main>
      <SiteFooter />
      <CartSheet />
      <ScrollRestoration />
    </>
  );
}
