'use client';

import PageHeading from '@/components/PageHeading';
import ProductsList from '@/components/products/ProductsList';
import Filter from '@/components/Filter';
import useProducts from '@/hooks/page/useProducts';
import React from 'react';

const Products = () => {
  const {
    products,
    loading,
    count,
    currentPage,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    onClickNext,
    onClickPrev,
  } = useProducts();

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading
          title='Products'
          enableBreadCrumb={true}
          layer2='Products'
        />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search products'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <section className='section-container-padding-0 mt-2'>
        <ProductsList
          products={products}
          count={count}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          currentPage={currentPage}
          loading={loading}
        />
      </section>
    </main>
  );
};

export default Products;
