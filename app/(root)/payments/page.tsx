'use client';

import PageHeading from '@/components/PageHeading';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import React from 'react';
import PaymentsList from '@/components/payments/PaymentsList';
import usePayments from '@/hooks/page/usePayments';

const Payments = () => {
  const {
    payments,
    loading: paymentsLoading,
    count: totalPayments,
    currentPage: paymentsCurrentPage,
    onClickNext: paymentsOnClickNext,
    onClickPrev: paymentsOnClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = usePayments();

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading
          title='Payments'
          enableBreadCrumb={true}
          layer2='Payments'
        />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search payments by ID'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <section className='section-container-padding-0 mt-2'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <PaymentsList
              payments={payments}
              count={totalPayments}
              onClickNext={paymentsOnClickNext}
              onClickPrev={paymentsOnClickPrev}
              currentPage={paymentsCurrentPage}
              loading={paymentsLoading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Payments;
