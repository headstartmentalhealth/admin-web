import PageHeading from '@/components/PageHeading';
import React from 'react';
import ResourceManager from '@/components/resources/ResourceManager';

const Affirmatives = () => {
  return (
    <main className='section-container py-10'>
      <header>
        <PageHeading
          title='Affirmatives'
          enableBreadCrumb={true}
          layer2='Resources'
          layer2Link='/resources'
          layer3='Affirmatives'
        />
      </header>
      <section className='mt-10'>
        <ResourceManager type='AFFIRMATIVE' title='Affirmative' />
      </section>
    </main>
  );
};

export default Affirmatives;
