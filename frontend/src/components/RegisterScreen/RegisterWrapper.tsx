import Button from '@/components/UI/Button';
import { FormEvent, useState } from 'react';

const RegisterWrapper = () => {
  type TRegisterForm = {
    fullName: string;
    email: string;
    password: string;
  };

  const [registerForm, setRegisterForm] = useState<TRegisterForm>({
    fullName: '',
    email: '',
    password: '',
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className='mx-auto w-fit h-full p-12 rounded-xl border dark:border-zinc-500/50'>
      <div className='flex flex-col gap-6 text-center mb-6'>
        <h1 className='text-4xl font-thin capitalize tracking-tight'>Welcome</h1>
      </div>
      <form
        onSubmit={onSubmit}
        className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <label>Full Name</label>
          <input
            name='fullName'
            value={registerForm.fullName}
            onChange={(e) =>
              setRegisterForm((prevRegisterForm) => ({
                ...prevRegisterForm,
                [e.target.name]: e.target.value,
              }))
            }
            type='text'
            placeholder='Enter Full Name'
            className='flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm ring-offset-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
        <div className='flex flex-col gap-3'>
          <label>Email address</label>
          <input
            name='email'
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm((prevRegisterForm) => ({
                ...prevRegisterForm,
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
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm((prevRegisterForm) => ({
                ...prevRegisterForm,
                [e.target.name]: e.target.value,
              }))
            }
            type='password'
            placeholder='Password'
            className='flex h-10 w-full rounded-md border bg-zinc-50 px-3 py-2 text-sm ring-offset-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
        <div className='mx-auto text-zinc-500 max-w-xs text-xs text-justify'>By continuing, you are setting up a One Stop Shop account and agree to our User Agreement and Privacy Policy.</div>
        <Button>Register</Button>
      </form>
    </div>
  );
};

export default RegisterWrapper;
