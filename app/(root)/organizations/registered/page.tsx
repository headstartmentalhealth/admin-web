'use client';

import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';

import React from 'react';
import useOrgs from '@/hooks/page/useOrgs';
import OrgsList from '@/components/organizations/OrgsList';
import { BusinessState } from '@/lib/utils';

const RegisteredOrganizations = () => {
  const {
    organizations,
    loading,
    count,
    currentPage,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    onClickNext,
    onClickPrev,
  } = useOrgs();

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading
          title='All Registered Organizations'
          enableBreadCrumb={true}
          layer2='Organizations'
          layer3='Registered'
        />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search Organizations'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <section className='section-container-padding-0 mt-2'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <OrgsList
              type={BusinessState.registered}
              organizations={organizations}
              count={count}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
              currentPage={currentPage}
              loading={loading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisteredOrganizations;
