import GuestNavActions from '@/components/Navigation/GuestNavActions';
import UserNavActions from '@/components/Navigation/UserNavActions';
import { Link } from 'react-router-dom';
import ThemeToggleButton from '../UI/ThemeToggleButton';

const Header = () => {
  const user = false;
  return (
    <>
      {/* BEGIN - HEADER */}
      <header className='fixed z-10 w-full transition-all duration-300 border-b bg-zinc-50 dark:bg-zinc-900'>
        {/* BEGIN - NAVIGATION BAR CONTAINER */}
        <nav className='container flex items-center justify-between py-3'>
          {/* BEGIN - NAV BAR BRAND NAME */}
          <h1 className='text-2xl font-bold cursor-pointer text-zinc-900 dark:text-zinc-50'>
            <Link to={'/'}>One Stop Shop</Link>
          </h1>
          {/* END - NAV BAR BRAND NAME */}

          {/* BEGIN - NAV BAR LINK LIST */}
          <ul className='flex items-center justify-end gap-6 text-base font-medium text-zinc-500'>
            {/* BEGIN - THEME BUTTON */}
            <ThemeToggleButton />
            {/* END - THEME BUTTON */}

            {/* BEGIN - WHEN NOT LOGGED IN - GUEST ACTIONS */}
            {!user && <GuestNavActions />}
            {/* END - WHEN NOT LOGGED IN - GUEST ACTIONS */}

            {/* BEGIN - WHEN LOGGED IN - USER ACTIONS */}
            {!!user && <UserNavActions />}
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
