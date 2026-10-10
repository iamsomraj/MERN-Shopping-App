import { useAuthStore } from '@/stores/auth';
import { Navigate, Outlet, useLocation } from 'react-router';

export function RequireAuth() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }
  return <Outlet />;
}

export function RequireAdmin() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }
  if (!user.isAdmin) {
    return (
      <Navigate
        to='/'
        replace
      />
    );
  }
  return <Outlet />;
}

/** Signed-in users skip the login and register pages. */
export function GuestOnly() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  if (user) {
    const redirect = new URLSearchParams(location.search).get('redirect');
    return (
      <Navigate
        to={redirect?.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'}
        replace
      />
    );
  }
  return <Outlet />;
}
