import Button from '@/components/UI/Button';
import { Link } from 'react-router-dom';

const GuestNavActions = () => {
  return (
    <>
      {/* LINK FOR LOGIN */}
      <li>
        <Button>
          <Link to={'/login'}>Login</Link>
        </Button>
      </li>
      {/* LINK FOR LOGIN */}

      {/* LINK FOR REGISTER */}
      <li>
        <Link to={'/register'}>Register</Link>
      </li>
      {/* LINK FOR REGISTER */}
    </>
  );
};

export default GuestNavActions;
