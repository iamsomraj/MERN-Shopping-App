import { updateUser } from '@/api/users';
import Button from '@/components/UI/Button';
import { getErrorMessage } from '@/config';
import { selectUser, setUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

type TProfileDetail = {
  name: string;
  email: string;
  password: string;
};

const ProfileWrapper = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [profileDetail, setProfileDetail] = useState<TProfileDetail>(() => {
    if (user) {
      return {
        name: user.name,
        email: user.email,
        password: '',
      };
    }
    return {
      name: '',
      email: '',
      password: '',
    };
  });

  const { mutate: update, isLoading } = useMutation({
    mutationFn: async () => {
      return await updateUser(profileDetail.name, profileDetail.email, profileDetail.password);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while we were trying to update your details!');
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      dispatch(
        setUser({
          user: {
            ...user,
            ...data,
          },
        })
      );
      toast.success('User updated successfully!');
    },
  });

  if (user == null) {
    return <Navigate to={'/'} />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (profileDetail.name?.trim().length === 0 || profileDetail.email?.trim().length === 0 || profileDetail.password?.trim().length === 0) {
      return;
    }
    await update();
  };

  return (
    <div className='mx-auto w-fit h-full p-12 rounded-xl border dark:border-zinc-500/50'>
      <form
        onSubmit={onSubmit}
        className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <label>Full Name</label>
          <input
            name='name'
            value={profileDetail.name}
            onChange={(e) =>
              setProfileDetail((prevProfileDetail) => ({
                ...prevProfileDetail,
                [e.target.name]: e.target.value,
              }))
            }
            type='text'
            placeholder='Enter Full Name'
            className='flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm text-zinc-900 ring-offset-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
        <div className='flex flex-col gap-3'>
          <label>Email address</label>
          <input
            name='email'
            value={profileDetail.email}
            onChange={(e) =>
              setProfileDetail((prevProfileDetail) => ({
                ...prevProfileDetail,
                [e.target.name]: e.target.value,
              }))
            }
            type='email'
            placeholder='Enter email'
            className='flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm text-zinc-900 ring-offset-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
          <span className='text-zinc-500 text-xs'>We'll never share your email with anyone else.</span>
        </div>
        <div className='flex flex-col gap-3'>
          <label>Password</label>
          <input
            name='password'
            value={profileDetail.password}
            onChange={(e) =>
              setProfileDetail((prevProfileDetail) => ({
                ...prevProfileDetail,
                [e.target.name]: e.target.value,
              }))
            }
            type='password'
            placeholder='Password'
            className='flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm text-zinc-900 ring-offset-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
        <Button
          disabled={profileDetail.email.trim() === '' || profileDetail.name.trim() === '' || profileDetail.password.trim() === ''}
          loading={isLoading}>
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfileWrapper;
