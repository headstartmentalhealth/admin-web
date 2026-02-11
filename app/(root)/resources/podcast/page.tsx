import PageHeading from '@/components/PageHeading';
import React from 'react';
import ResourceManager from '@/components/resources/ResourceManager';

const Podcast = () => {
  return (
    <main className='section-container py-10'>
      <header>
        <PageHeading
          title='Podcast'
          enableBreadCrumb={true}
          layer2='Resources'
          layer2Link='/resources'
          layer3='Podcast'
        />
      </header>
      <section className='mt-10'>
        <ResourceManager type='PODCAST' title='Podcast' />
      </section>
    </main>
  );
};

export default Podcast;
