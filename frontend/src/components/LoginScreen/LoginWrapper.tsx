import { signIn } from '@/api/auth';
import Button from '@/components/UI/Button';
import { getErrorMessage } from '@/config';
import { selectUser, setUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

type TLoginForm = {
  email: string;
  password: string;
};

const LoginWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [loginForm, setLoginForm] = useState<TLoginForm>({
    email: '',
    password: '',
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async () => {
      return await signIn(loginForm.email, loginForm.password);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while we were trying to log you in!');
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      dispatch(
        setUser({
          user: data,
        })
      );
      navigate('/');
      toast.success('User logged in successfully!');
    },
  });

  if (user != null) {
    return <Navigate to={'/'} />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginForm.email?.trim().length === 0 || loginForm.password?.trim().length === 0) {
      return;
    }
    await login();
  };

  return (
    <div className='mx-auto w-fit h-full p-12 rounded-xl border dark:border-zinc-500/50'>
      <div className='flex flex-col gap-6 text-center mb-6'>
        <h1 className='text-4xl font-thin capitalize tracking-tight'>Welcome back</h1>
      </div>
      <form
        onSubmit={onSubmit}
        className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <label>Email address</label>
          <input
            name='email'
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                [e.target.name]: e.target.value,
              }))
            }
            type='email'
            placeholder='Enter email'
            className='flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm ring-offset-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
          <span className='text-zinc-500 text-xs'>We'll never share your email with anyone else.</span>
        </div>
        <div className='flex flex-col gap-3'>
          <label>Password</label>
          <input
            name='password'
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                [e.target.name]: e.target.value,
              }))
            }
            type='password'
            placeholder='Password'
            className='flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm ring-offset-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
        <div className='mx-auto text-zinc-500 max-w-xs text-xs text-justify'>By continuing, you are setting up a One Stop Shop account and agree to our User Agreement and Privacy Policy.</div>
        <Button loading={isLoading}>Login</Button>
      </form>
    </div>
  );
};

export default LoginWrapper;
