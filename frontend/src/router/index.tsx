import App from '@/App';
import PrivateAdminRoute from '@/components/PrivateAdminRoute';
import PrivateRoute from '@/components/PrivateRoute';
import HomeScreen from '@/screens/HomeScreen';
import InventoryScreen from '@/screens/InventoryScreen';
import LoginScreen from '@/screens/LoginScreen';
import OrderScreen from '@/screens/OrderScreen';
import PaymentScreen from '@/screens/PaymentScreen';
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
        <Route
          path='/orders'
          element={<OrderScreen />}
        />
        <Route
          path='/payment/:orderId'
          element={<PaymentScreen />}
        />
      </Route>
      <Route
        path=''
        element={<PrivateAdminRoute />}>
        <Route
          path='/inventory'
          element={<InventoryScreen />}
        />
      </Route>
    </Route>
  )
);

export default router;
