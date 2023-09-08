import Button from '@/components/UI/Button';
import { UserIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

const GuestNavActions = () => {
  return (
    <>
      {/* LINK FOR LOGIN */}
      <li>
        <Button>
          <Link to={'/login'}>
            <div className='flex justify-center items-center gap-3'>
              <UserIcon className='h-5 w-5 flex-shrink-0' />
              <span className='hidden md:block'>Login</span>
            </div>
          </Link>
        </Button>
      </li>
      {/* LINK FOR LOGIN */}

      {/* LINK FOR REGISTER */}
      <li>
        <Button variant='transparent'>
          <Link to={'/register'}>
            <div className='flex justify-center items-center gap-3'>
              <UserPlusIcon className='h-5 w-5 flex-shrink-0' />
              <span className='hidden md:block'>Register</span>
            </div>
          </Link>
        </Button>
      </li>
      {/* LINK FOR REGISTER */}
    </>
  );
};

export default GuestNavActions;
