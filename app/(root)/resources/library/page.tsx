import PageHeading from '@/components/PageHeading';
import React from 'react';
import ResourceManager from '@/components/resources/ResourceManager';

const Library = () => {
  return (
    <main className='section-container py-10'>
      <header>
        <PageHeading
          title='Library'
          enableBreadCrumb={true}
          layer2='Resources'
          layer2Link='/resources'
          layer3='Library'
        />
      </header>
      <section className='mt-10'>
        <ResourceManager type='LIBRARY' title='Library' />
      </section>
    </main>
  );
};

export default Library;
