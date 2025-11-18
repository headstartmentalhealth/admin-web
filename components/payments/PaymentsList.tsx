'use client';

import React from 'react';
import ProductItem from './PaymentItem';
import Pagination from '../Pagination';
import TableEndRecord from '../ui/TableEndRecord';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import { Transaction } from '@/types/payment';
import PaymentItem from './PaymentItem';

interface PaymentListProps {
  payments: Transaction[];
  count: number;
  onClickNext: () => Promise<void>;
  onClickPrev: () => Promise<void>;
  currentPage: number;
  loading: boolean;
}
const PaymentsList = ({
  payments,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: PaymentListProps) => {
  const searchParams = useSearchParams();
  if (loading) return <LoadingSkeleton />;

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <div className='overflow-x-auto rounded-none'>
      <div className='relative overflow-x-auto'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Payment ID
              </th>
              <th scope='col' className='px-6 py-3'>
                Purchased by
              </th>
              <th scope='col' className='px-6 py-3'>
                Item(s) purchased
              </th>
              <th scope='col' className='px-6 py-3'>
                Amount
              </th>
              <th scope='col' className='px-6 py-3'>
                Payment Method
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <PaymentItem key={payment.id} payment={payment} />
            ))}

            {!payments.length && (
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
          noMoreNextPage={payments.length === 0}
        />
      </div>
    </div>
  );
};

export default PaymentsList;
