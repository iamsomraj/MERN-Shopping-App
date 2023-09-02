import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const cond = true;
  return cond ? (
    <Outlet />
  ) : (
    <Navigate
      to='/login'
      replace
    />
  );
};
export default PrivateRoute;
