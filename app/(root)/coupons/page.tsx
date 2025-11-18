'use client';

import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import React from 'react';
import CouponsList from '@/components/coupons/CouponsList';
import useCoupons from '@/hooks/page/useCoupons';

const Coupons = () => {
  const {
    coupons,
    loading: couponsLoading,
    count: totalCoupons,
    currentPage: couponsCurrentPage,
    onClickNext: couponsOnClickNext,
    onClickPrev: couponsOnClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useCoupons();

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading title='Coupons' enableBreadCrumb={true} layer2='Coupons' />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search coupons'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <section className='section-container-padding-0 mt-2'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <CouponsList
              coupons={coupons}
              count={totalCoupons}
              onClickNext={couponsOnClickNext}
              onClickPrev={couponsOnClickPrev}
              currentPage={couponsCurrentPage}
              loading={couponsLoading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Coupons;
