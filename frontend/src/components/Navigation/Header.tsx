import GuestNavActions from '@/components/Navigation/GuestNavActions';
import UserNavActions from '@/components/Navigation/UserNavActions';
import ThemeToggleButton from '@/components/UI/ThemeToggleButton';
import { selectUser } from '@/features/auth/authSlice';
import { openDrawer, selectCart } from '@/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Link } from 'react-router-dom';
import CartButton from './CartButton';

const Header = () => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(selectCart);
  const dispatch = useAppDispatch();
  const openCart = () => {
    dispatch(openDrawer());
  };
  return (
    <>
      {/* BEGIN - HEADER */}
      <header className='fixed z-10 w-full transition-all duration-300 shadow dark:shadow-zinc-50/10 dark:shadow-lg bg-zinc-50 dark:bg-zinc-900'>
        {/* BEGIN - NAVIGATION BAR CONTAINER */}
        <nav className='container flex items-center justify-between py-3'>
          {/* BEGIN - NAV BAR BRAND NAME */}
          <h1 className='text-sm md:text-2xl font-bold cursor-pointer text-zinc-900 dark:text-zinc-50'>
            <Link to={'/'}>One Stop EShop</Link>
          </h1>
          {/* END - NAV BAR BRAND NAME */}

          {/* BEGIN - NAV BAR LINK LIST */}
          <ul className='flex items-center justify-end gap-3 text-base font-medium text-zinc-500'>
            {/* BEGIN - THEME BUTTON */}
            <ThemeToggleButton />
            {/* END - THEME BUTTON */}

            {/* BEGIN - WHEN NOT LOGGED IN - GUEST ACTIONS */}
            {user == null && <GuestNavActions />}
            {/* END - WHEN NOT LOGGED IN - GUEST ACTIONS */}

            {/* BEGIN - CART */}
            <CartButton
              cart={cart}
              openCart={openCart}
            />
            {/* END - CART */}

            {/* BEGIN - WHEN LOGGED IN - USER ACTIONS */}
            {user != null && <UserNavActions />}
            {/* END - WHEN LOGGED IN - USER ACTIONS */}
          </ul>
          {/* END - NAV BAR LINK LIST */}
        </nav>
        {/* END - NAVIGATION BAR CONTAINER */}
      </header>
      {/* END - HEADER */}
    </>
  );
};

export default Header;
