'use client';

import Bar from '@/components/bar/Index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push('/sign-in');
    }
  }, [mounted, token, router]);

  if (!mounted || !token) return null;

  return (
    <main className='flex h-screen w-full font-inter'>
      <div className='flex size-full flex-col'>
        <div className='main-container'>
          <Bar />
          {children}
        </div>
      </div>
    </main>
  );
}
