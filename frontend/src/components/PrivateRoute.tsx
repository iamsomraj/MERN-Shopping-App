import { selectUser } from '@/features/auth/authSlice';
import { useAppSelector } from '@/hooks';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const user = useAppSelector(selectUser);
  return user != null ? (
    <Outlet />
  ) : (
    <Navigate
      to='/login'
      replace
    />
  );
};
export default PrivateRoute;
