'use client';

import React from 'react';
import CartItem from './CartItem';
import Pagination from '../Pagination';
import TableEndRecord from '../ui/TableEndRecord';
import { ProductDetails } from '@/types/product';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import { Cart } from '@/types/cart';

interface CartListProps {
  carts: Cart[];
  count: number;
  onClickNext: () => Promise<void>;
  onClickPrev: () => Promise<void>;
  currentPage: number;
  loading: boolean;
}
const CartList = ({
  carts,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: CartListProps) => {
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
                Items
              </th>
              <th scope='col' className='px-6 py-3'>
                User
              </th>
              <th scope='col' className='px-6 py-3'>
                Total
              </th>
              <th scope='col' className='px-6 py-3'>
                Organization
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Added
              </th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <CartItem key={cart.id} cart_item={cart} />
            ))}

            {!carts.length && <TableEndRecord colspan={8} text={noFoundText} />}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          total={count}
          currentPage={currentPage}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          noMoreNextPage={carts.length === 0}
        />
      </div>
    </div>
  );
};

export default CartList;
