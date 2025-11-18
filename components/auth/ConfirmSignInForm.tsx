'use client';

import React, { useEffect, useState } from 'react';

import { decryptInput, isEncrypted } from '@/lib/utils';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyLoginFormSchema } from '@/lib/schema/auth.schema';
import { Loader2 } from 'lucide-react';
import { verifyLogin } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import OTPInput from '../ui/OtpInput';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';

const defaultValue = {
  otp: '',
};

const ConfirmSignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')!;
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);

  const [body, setBody] = useState(defaultValue);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const email = decryptInput(token);

      const { error, value } = VerifyLoginFormSchema.validate({
        ...body,
        email,
      });

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const { otp } = body;

      const response: any = await dispatch(verifyLogin({ email, otp }));

      if (response.type === 'auth/verify-otp/rejected') {
        throw new Error(response.payload.message);
      }

      router.push('/');
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = (otp: string) => {
    setBody({ ...body, otp });
  };

  useEffect(() => {
    if (!token || !isEncrypted(token)) {
      router.push('/sign-in');
    }
  }, [token, dispatch, router]);

  return (
    <>
      <form className='mt-8' onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <div className='flex mt-5 mb-8'>
            <OTPInput onComplete={handleOTPComplete} />
          </div>

          <button
            type='submit'
            className='w-full flex justify-center items-center px-5 py-3 text-base font-medium text-white bg-primary-main rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-main dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <Loader2 size={20} className='animate-spin' />
                <span>Loading...</span>
              </div>
            ) : (
              'Proceed to your account'
            )}
          </button>

          <Link
            href={'/sign-in'}
            className='text-sm text-center mt-3 hover:underline'
          >
            <div className='flex justify-center items-center gap-1'>
              <IoIosArrowBack />
              Back to Signin
            </div>
          </Link>
        </div>
      </form>
    </>
  );
};

export default ConfirmSignInForm;
