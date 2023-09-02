import { Link } from 'react-router-dom';
import Button from '@/components/UI/Button';

const Header = () => {
  return (
    <header className='fixed z-10 bg-white border-b w-full'>
      {/* BEGIN - NAVIGATION BAR CONTAINER */}
      <nav className='container py-3 flex justify-between items-center'>
        {/* BEGIN - NAV BAR BRAND NAME */}
        <h1 className='font-bold text-zinc-900 text-2xl cursor-pointer'>
          <Link to={'/'}>One Stop Shop</Link>
        </h1>
        {/* END - NAV BAR BRAND NAME */}

        {/* BEGIN - NAV BAR LINK LIST */}
        <ul className='flex justify-end items-center gap-3 text-base font-medium text-zinc-500'>
          <li>
            <Button>
              <Link to={'/login'}>Login</Link>
            </Button>
          </li>
          <li>
            <Link to={'/register'}>Register</Link>
          </li>
        </ul>
        {/* END - NAV BAR LINK LIST */}
      </nav>
      {/* END - NAVIGATION BAR CONTAINER */}
    </header>
  );
};

export default Header;
