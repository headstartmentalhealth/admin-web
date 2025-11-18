'use client';

import React from 'react';
import SidebarMenu from './SidebarMenu';

const SidebarNav = () => {
  return (
    <aside className='fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700'>
      <div className='overflow-y-auto py-5 h-full bg-white dark:bg-gray-800'>
        <SidebarMenu />
      </div>
    </aside>
  );
};

export default SidebarNav;
