'use client';

import React, { useState } from 'react';
import SidebarNav from './sidebar/SidebarNav';
import Topbar from './topbar/Topbar';

const Bar = () => {
  return (
    <div>
      <Topbar />
      <SidebarNav />
    </div>
  );
};

export default Bar;
