import { GuestOnly, RequireAdmin, RequireAuth } from '@/components/auth/RouteGuards';
import { RouteError } from '@/components/common/RouteError';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { featuredQuery, productFiltersQuery, productQuery, productsQuery } from '@/api/products';
import { pages } from '@/lib/pages';
import { queryClient } from '@/lib/query-client';
import { createBrowserRouter, type RouteObject } from 'react-router';

// Static loaders run in parallel with the lazy page download, so data and code arrive together.
const prefetchHome = () => {
  void queryClient.prefetchQuery(productsQuery(featuredQuery));
  void queryClient.prefetchQuery(productFiltersQuery);
  return null;
};

/** Lazy route: the page's code is only downloaded when it is first visited. */
const lazyPage = (load: () => Promise<{ default: React.ComponentType }>): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => ({ Component: (await load()).default }),
});

export const router = createBrowserRouter([
  {
    element: <StorefrontLayout />,
    errorElement: <RouteError />,
    HydrateFallback: () => null,
    children: [
      { index: true, loader: prefetchHome, ...lazyPage(pages.home) },
      { path: 'shop', ...lazyPage(pages.shop) },
      {
        path: 'products/:slug',
        loader: ({ params }) => {
          void queryClient.prefetchQuery(productQuery(params.slug ?? ''));
          return null;
        },
        ...lazyPage(pages.product),
      },
      { path: 'cart', ...lazyPage(pages.cart) },
      {
        element: <GuestOnly />,
        children: [
          { path: 'login', ...lazyPage(pages.login) },
          { path: 'register', ...lazyPage(pages.register) },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          { path: 'checkout', ...lazyPage(pages.checkout) },
          { path: 'orders', ...lazyPage(pages.orders) },
          { path: 'orders/:id', ...lazyPage(pages.order) },
          { path: 'account', ...lazyPage(pages.account) },
        ],
      },
      { path: '*', ...lazyPage(pages.notFound) },
    ],
  },
  {
    path: 'admin',
    element: <RequireAdmin />,
    errorElement: <RouteError />,
    children: [
      {
        ...lazyPage(pages.adminLayout),
        children: [
          { index: true, ...lazyPage(pages.adminDashboard) },
          { path: 'products', ...lazyPage(pages.adminProducts) },
          { path: 'products/new', ...lazyPage(pages.adminProductForm) },
          { path: 'products/:id/edit', ...lazyPage(pages.adminProductForm) },
          { path: 'orders', ...lazyPage(pages.adminOrders) },
          { path: 'orders/:id', ...lazyPage(pages.adminOrder) },
          { path: 'users', ...lazyPage(pages.adminUsers) },
        ],
      },
    ],
  },
]);
