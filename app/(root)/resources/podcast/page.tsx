import PageHeading from '@/components/PageHeading';
import React from 'react';

const Podcast = () => {
  return (
    <main className='section-container py-10'>
      <header>
        <PageHeading
          title='Podcast'
          enableBreadCrumb={true}
          layer2='Resources'
          layer3='Podcast'
        />
      </header>
    </main>
  );
};

export default Podcast;
