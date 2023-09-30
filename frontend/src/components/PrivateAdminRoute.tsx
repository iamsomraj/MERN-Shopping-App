import { selectUser } from '@/features/auth/authSlice';
import { useAppSelector } from '@/hooks';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateAdminRoute = () => {
  const user = useAppSelector(selectUser);
  return user == null ? (
    <Navigate
      to='/login'
      replace
    />
  ) : user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate
      to='/profile'
      replace
    />
  );
};
export default PrivateAdminRoute;
