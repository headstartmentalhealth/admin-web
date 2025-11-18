'use client';

import React from 'react';
import Pagination from '../Pagination';
import TableEndRecord from '../ui/TableEndRecord';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import { Transaction } from '@/types/payment';
import { SubscriptionPlan } from '@/types/subscription-plan';
import { MediaDetails } from '@/types/multimedia';
import MultimediaItem from './MultimediaItem';

interface MultimediaListProps {
  multimedia: MediaDetails[];
  count: number;
  onClickNext: () => Promise<void>;
  onClickPrev: () => Promise<void>;
  currentPage: number;
  loading: boolean;
}
const MultimediaList = ({
  multimedia,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: MultimediaListProps) => {
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
                ID
              </th>
              <th scope='col' className='px-6 py-3'>
                URL
              </th>
              <th scope='col' className='px-6 py-3'>
                Type
              </th>
              <th scope='col' className='px-6 py-3'>
                Provider
              </th>
              <th scope='col' className='px-6 py-3'>
                Created By
              </th>
              <th scope='col' className='px-6 py-3'>
                Organization
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {multimedia.map((media_item) => (
              <MultimediaItem key={media_item.id} multimedia={media_item} />
            ))}

            {!multimedia.length && (
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
          noMoreNextPage={multimedia.length === 0}
        />
      </div>
    </div>
  );
};

export default MultimediaList;
