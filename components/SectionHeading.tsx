'use client';

import React from 'react';

const SectionHeading = ({ title }: { title?: React.ReactNode }) => {
  return (
    <>
      {title && (
        <div className='mb-5'>
          <h1 className='text-2xl font-bold'>{title}</h1>
        </div>
      )}
    </>
  );
};

export default SectionHeading;
