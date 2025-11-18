'use client';

import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';

import React from 'react';
import PaymentsList from '@/components/payments/PaymentsList';
import useDistinctPayments from '@/hooks/page/useDistinctPayments';
import { PurchaseItemType } from '@/lib/utils';

const SubscriptionSubscribers = () => {
  const {
    distinctPayments,
    distinctLoading: distinctPaymentsLoading,
    countDistinct: totalDistinctPayments,
    currentPage: distinctPaymentsCurrentPage,
    onClickNext: distinctPaymentsOnClickNext,
    onClickPrev: distinctPaymentsOnClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useDistinctPayments({ purchase_type: PurchaseItemType.SUBSCRIPTION });

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading
          title='Subscribers'
          enableBreadCrumb={true}
          layer2='Subscription'
          layer3='Subscribers'
        />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search for subscribers'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <section className='section-container-padding-0 mt-2'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            {/* Users list in a table - registered */}
            <PaymentsList
              payments={distinctPayments}
              count={totalDistinctPayments}
              onClickNext={distinctPaymentsOnClickNext}
              onClickPrev={distinctPaymentsOnClickPrev}
              currentPage={distinctPaymentsCurrentPage}
              loading={distinctPaymentsLoading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SubscriptionSubscribers;
