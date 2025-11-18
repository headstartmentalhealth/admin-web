import PageHeading from '@/components/PageHeading';
import React from 'react';

const BlogPosts = () => {
  return (
    <main className='section-container py-10'>
      <header>
        <PageHeading
          title='Blog Posts'
          enableBreadCrumb={true}
          layer2='Blog Posts'
        />
      </header>
    </main>
  );
};

export default BlogPosts;
