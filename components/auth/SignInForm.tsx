'use client';

import React, { useState } from 'react';

import { encryptInput } from '@/lib/utils';
import Checkbox from '../ui/Checkbox';
import Input from '../ui/Input';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { LoginFormSchema } from '@/lib/schema/auth.schema';
import { Loader2 } from 'lucide-react';
import { login, logout } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';

const defaultValue = {
  email: '',
  password: '',
};

const ConfirmSignInForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [body, setBody] = useState(defaultValue);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const { error, value } = LoginFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const { email, password } = body;

      const response: any = await dispatch(login({ email, password }));

      if (response.type === 'auth/request-otp/rejected') {
        throw new Error(response.payload.message);
      }

      // Encrypt input
      const encrypted = encryptInput(email);

      router.push(`/confirm-signin?token=${encrypted}`);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor='email'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Email address
          </label>
          <Input
            type='email'
            name='email'
            placeholder='Email address'
            onChange={(e: any) => setBody({ ...body, email: e.target.value })}
            value={body.email}
            required={true}
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Password
          </label>
          <Input
            type='password'
            name='password'
            placeholder='Password'
            onChange={(e: any) =>
              setBody({ ...body, password: e.target.value })
            }
            value={body.password}
            required={true}
          />
        </div>

        <div className='flex items-start'>
          <div className='flex items-center h-5'>
            <Checkbox type='checkbox' name='remember' />
          </div>

          <div className='ml-3 text-sm'>
            <label
              htmlFor='remember'
              className='font-medium text-gray-900 dark:text-white'
            >
              Remember me
            </label>
          </div>
        </div>
        <button
          type='submit'
          className='w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-main rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-main dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex justify-center items-center'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
            </>
          ) : (
            'Login to your account'
          )}
        </button>
      </form>
    </>
  );
};

export default ConfirmSignInForm;
