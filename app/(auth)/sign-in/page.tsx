import SignInForm from '@/components/auth/SignInForm';
import Image from 'next/image';
import React from 'react';

const SignIn = () => {
  return (
    <section className='flex flex-col items-center justify-center px-6 pt-8 mx-auto h-screen pt:mt-0 dark:bg-gray-900'>
      <a
        href='#'
        className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white'
      >
        <Image
          src={'/logo.png'}
          width={150}
          height={150}
          alt='Logo'
          className='m-auto block dark:hidden'
          priority
        />
        <Image
          src={'/logo-white.png'}
          width={150}
          height={150}
          alt='Logo'
          className='m-auto hidden dark:block'
          priority
        />
      </a>
      {/* <!-- Card --> */}
      <div className='w-full max-w-xl p-6 space-y-8 sm:p-8 rounded-lg shadow dark:bg-gray-800 bg-white'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Sign in to platform
        </h2>
        <SignInForm />
      </div>
    </section>
  );
};

export default SignIn;
