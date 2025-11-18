'use client';

import { Modal } from 'flowbite-react';
import React, { useState } from 'react';
import { IoIosFunnel } from 'react-icons/io';

import Input from '@/components/ui/Input';
import Filter from '@/components/Filter';
import PageHeading from '@/components/PageHeading';
import Pagination from '@/components/Pagination';
import UsersList from '@/components/organizations/OrgsList';
import useOrgs from '@/hooks/page/useOrgs';
import OrgsList from '@/components/organizations/OrgsList';
import { BusinessState } from '@/lib/utils';

const DeletedOrganizations = () => {
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
  } = useOrgs({ deleted: true });

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading
          title='All Deleted Organizations'
          enableBreadCrumb={true}
          layer2='Organizations'
          layer3='Deleted'
        />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search...'
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
              type={BusinessState.deleted}
              organizations={organizations}
              count={count}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
              currentPage={currentPage}
              loading={loading}
              isDeleted={true}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeletedOrganizations;
