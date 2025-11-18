'use client';

import React from 'react';
import ProductItem from './ProductItem';
import Pagination from '../Pagination';
import TableEndRecord from '../ui/TableEndRecord';
import { ProductDetails } from '@/types/product';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';

interface ProductsListProps {
  products: ProductDetails[];
  count: number;
  onClickNext: () => Promise<void>;
  onClickPrev: () => Promise<void>;
  currentPage: number;
  loading: boolean;
}
const ProductsList = ({
  products,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: ProductsListProps) => {
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
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Price
              </th>
              <th scope='col' className='px-6 py-3'>
                Organization
              </th>
              <th scope='col' className='px-6 py-3'>
                Category
              </th>
              <th scope='col' className='px-6 py-3'>
                Type
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3'>
                Published Date
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}

            {!products.length && (
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
          noMoreNextPage={products.length === 0}
        />
      </div>
    </div>
  );
};

export default ProductsList;
