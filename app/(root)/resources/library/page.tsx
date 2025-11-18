import PageHeading from '@/components/PageHeading';
import React from 'react';

const Library = () => {
  return (
    <main className='section-container py-10'>
      <header>
        <PageHeading
          title='Library'
          enableBreadCrumb={true}
          layer2='Resources'
          layer3='Library'
        />
      </header>
    </main>
  );
};

export default Library;
