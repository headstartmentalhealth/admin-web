'use client';

import React, { useState } from 'react';
import Apps from './Apps';
import Profile from './Profile';
import Link from 'next/link';
import MobileNav from '../sidebar/MobileNav';
import Logo from '@/components/ui/Logo';
import RecentNotifications from './RecentNotifications';

const Topbar = () => {
  const [isOpen, setIsOpen] = useState({
    profileDialog: false,
    appsDialog: false,
  });

  return (
    <nav className='bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50'>
      <div className='flex flex-wrap justify-between items-center'>
        <div className='flex justify-start items-center'>
          {/* Mobile nav */}
          <MobileNav />
          {/* Logo */}
          <Link href='/' className='flex items-center justify-between mr-4'>
            <Logo width={120} height={120} />
          </Link>
        </div>
        <div className='flex items-center lg:order-2 gap-1'>
          <RecentNotifications />

          {/* Apps */}
          <Apps isOpen={isOpen} setIsOpen={setIsOpen} />

          {/* Profile */}
          <Profile isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      {/* Drawer for mobile view */}
    </nav>
  );
};

export default Topbar;
