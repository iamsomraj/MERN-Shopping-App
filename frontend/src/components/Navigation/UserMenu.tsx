import { logOutUser, selectUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { ArrowLeftOnRectangleIcon, QueueListIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(false);

  if (user == null) {
    return null;
  }

  const nameParts = user.name
    .split(' ')
    .slice(0, 2)
    .map((item) => item[0])
    .join('');

  const onToggle = () => setShow((prevShow) => !prevShow);

  const signOut = () => {
    dispatch(logOutUser());
    onToggle();
    toast.success('User logged out successfully!');
  };

  const onNavigate = (route: string) => {
    navigate(`/${route}`);
    onToggle();
  };

  return (
    <div className='relative z-20 flex justify-center items-center'>
      <button
        onClick={onToggle}
        className='h-10 w-10 flex cursor-pointer justify-center items-center border bg-zinc-50 dark:bg-zinc-200 rounded-full'>
        {nameParts}
      </button>
      {show && (
        <>
          <div
            onClick={onToggle}
            className='fixed inset-0'></div>
          <ul className='absolute top-[115%] right-0 w-fit py-2 border dark:border-zinc-600 bg-zinc-50 dark:text-zinc-50 dark:bg-zinc-700 rounded-lg drop-shadow-xl overflow-hidden'>
            <li
              onClick={() => onNavigate('profile')}
              className='px-3 py-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 cursor-pointer'>
              <div className='flex justify-start items-center gap-3'>
                <UserCircleIcon className='h-5 w-5 flex-shrink-0 ' />
                <span>Profile</span>
              </div>
            </li>
            <li
              onClick={() => onNavigate('orders')}
              className='px-3 py-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 cursor-pointer'>
              <div className='flex justify-start items-center gap-3'>
                <QueueListIcon className='h-5 w-5 flex-shrink-0 ' />
                <span>Orders</span>
              </div>
            </li>
            <li
              onClick={signOut}
              className='px-3 py-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 cursor-pointer'>
              <div className='flex justify-start items-center gap-3'>
                <ArrowLeftOnRectangleIcon className='h-5 w-5 flex-shrink-0 ' />
                <span>Logout</span>
              </div>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default UserMenu;
