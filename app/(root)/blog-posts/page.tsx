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
      <section className='section-container-padding-0 mt-2'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            {/* <BlogPostList
              customers={customers}
              count={totalCustomers}
              onClickNext={customersOnClickNext}
              onClickPrev={customersOnClickPrev}
              currentPage={customersCurrentPage}
              loading={customersLoading}
            /> */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPosts;
