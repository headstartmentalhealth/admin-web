'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Cart } from '@/types/cart';
import { Customer } from '@/types/organization';
import CustomerItem from './CustomerItem';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
import Pagination from '@/components/Pagination';

interface CustomersListProps {
  customers: Customer[];
  count: number;
  onClickNext: () => void;
  onClickPrev: () => void;
  currentPage: number;
  loading: boolean;
}
const CustomersList = ({
  customers,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: CustomersListProps) => {
  const searchParams = useSearchParams();
  if (loading) return <LoadingSkeleton />;

  const noFoundText = !count ? 'No record found.' : undefined;

  return (
    <div className='overflow-x-auto rounded-none'>
      <div className='relative overflow-x-auto'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                ID
              </th>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Email
              </th>
              <th scope='col' className='px-6 py-3'>
                Phone
              </th>
              <th scope='col' className='px-6 py-3'>
                Role
              </th>
              <th scope='col' className='px-6 py-3'>
                Country
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <CustomerItem key={customer.id} customer={customer} />
            ))}

            {!customers.length && (
              <TableEndRecord colspan={8} text={noFoundText} />
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          total={count}
          currentPage={currentPage}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          noMoreNextPage={customers.length === 0}
        />
      </div>
    </div>
  );
};

export default CustomersList;
