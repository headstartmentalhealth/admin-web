'use client';

import Filter from '@/components/Filter';
import CustomersList from '@/components/organizations/customers/CustomersList';
import PageHeading from '@/components/PageHeading';
import useCustomers from '@/hooks/page/useCustomers';
import { SystemRole } from '@/lib/utils';
import React from 'react';

const Users = () => {
  const {
    customers,
    loading: customersLoading,
    count: totalCustomers,
    currentPage: customersCurrentPage,
    onClickNext: customersOnClickNext,
    onClickPrev: customersOnClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useCustomers({ role: SystemRole.USER });

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading title='Users' enableBreadCrumb={true} layer2='Users' />
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
            <CustomersList
              customers={customers}
              count={totalCustomers}
              onClickNext={customersOnClickNext}
              onClickPrev={customersOnClickPrev}
              currentPage={customersCurrentPage}
              loading={customersLoading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Users;
