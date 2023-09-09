import Button from '@/components/UI/Button';
import { logOutUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/hooks';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid';
import toast from 'react-hot-toast';

const UserNavActions = () => {
  const dispatch = useAppDispatch();

  const signOut = () => {
    dispatch(logOutUser());
    toast.success('User logged out successfully!');
  };

  return (
    <div>
      <Button
        variant='transparent'
        onClick={signOut}>
        <div className='flex justify-center items-center gap-1'>
          <ArrowLeftOnRectangleIcon className='h-5 w-5 flex-shrink-0 ' />
          <span className=''>Logout</span>
        </div>
      </Button>
    </div>
  );
};

export default UserNavActions;
