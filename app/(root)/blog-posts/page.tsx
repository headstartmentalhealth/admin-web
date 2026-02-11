import PageHeading from '@/components/PageHeading';
import BlogPostManager from '@/components/blog/BlogPostManager';
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
      <section className='mt-6'>
        <BlogPostManager />
      </section>
    </main>
  );
};

export default BlogPosts;
