'use client';

import React from 'react';
import ProductItem from './SubscriptionPlanItem';
import Pagination from '../Pagination';
import TableEndRecord from '../ui/TableEndRecord';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import { Transaction } from '@/types/payment';
import PaymentItem from './SubscriptionPlanItem';
import { SubscriptionPlan } from '@/types/subscription-plan';
import SubscriptionPlanItem from './SubscriptionPlanItem';

interface SubscriptionPlansListProps {
  subscription_plans: SubscriptionPlan[];
  count: number;
  onClickNext: () => Promise<void>;
  onClickPrev: () => Promise<void>;
  currentPage: number;
  loading: boolean;
}
const SubscriptionPlansList = ({
  subscription_plans,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: SubscriptionPlansListProps) => {
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
                Plan ID
              </th>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Created By
              </th>
              <th scope='col' className='px-6 py-3'>
                Organization
              </th>
              <th scope='col' className='px-6 py-3'>
                Pricing Detail(s)
              </th>
              <th scope='col' className='px-6 py-3'>
                Role(s)
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Created
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {subscription_plans.map((subscription_plan) => (
              <SubscriptionPlanItem
                key={subscription_plan.id}
                subscription_plan={subscription_plan}
              />
            ))}

            {!subscription_plans.length && (
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
          noMoreNextPage={subscription_plans.length === 0}
        />
      </div>
    </div>
  );
};

export default SubscriptionPlansList;
