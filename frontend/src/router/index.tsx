import App from '@/App';
import PrivateRoute from '@/components/PrivateRoute';
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import SingleProductScreen from '@/screens/SingleProductScreen';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      element={<App />}>
      <Route
        index={true}
        path='/'
        element={<HomeScreen />}
      />
      <Route
        path='/products/:productId'
        element={<SingleProductScreen />}
      />
      <Route
        path='/login'
        element={<LoginScreen />}
      />
      <Route
        path='/register'
        element={<RegisterScreen />}
      />
      <Route
        path=''
        element={<PrivateRoute />}>
        <Route
          path='/profile'
          element={<ProfileScreen />}
        />
      </Route>
    </Route>
  )
);

export default router;
