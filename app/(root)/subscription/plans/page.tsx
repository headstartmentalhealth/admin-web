'use client';

import React from 'react';

import Filter from '@/components/Filter';
import PageHeading from '@/components/PageHeading';
import useSubscriptionPlans from '@/hooks/page/useSubscriptionPlans';
import SubscriptionPlansList from '@/components/subscriptions/SubscriptionPlansList';

const SubscriptionPlans = () => {
  const {
    subscription_plans,
    loading: subscriptionPlansLoading,
    count: totalSubscriptionPlans,
    currentPage: subscriptionPlansCurrentPage,
    onClickNext: subscriptionPlansOnClickNext,
    onClickPrev: subscriptionPlansOnClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useSubscriptionPlans();

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading
          title='Subscription Plans'
          enableBreadCrumb={true}
          layer2='Subscription'
          layer3='Plans'
        />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search by subscription plans'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <section className='section-container-padding-0 mt-2'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <SubscriptionPlansList
              subscription_plans={subscription_plans}
              count={totalSubscriptionPlans}
              onClickNext={subscriptionPlansOnClickNext}
              onClickPrev={subscriptionPlansOnClickPrev}
              currentPage={subscriptionPlansCurrentPage}
              loading={subscriptionPlansLoading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SubscriptionPlans;
