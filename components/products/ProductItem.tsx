import {
  formatMoney,
  getLeastTicketTierPrice,
  ProductStatus,
} from '@/lib/utils';
import { ProductDetails } from '@/types/product';
import React, { useState } from 'react';
import Drawer from '@/components/ui/Drawer'; // Import a drawer component

import Image from 'next/image';
import moment from 'moment'; // Import moment.js

interface ProductItemProps {
  product: ProductDetails;
}
const ProductItem = ({ product }: ProductItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const priceData = product.price ? (
    formatMoney(+product.price, product.currency)
  ) : (
    <>
      {formatMoney(
        +getLeastTicketTierPrice(product.ticket.ticket_tiers),
        product.currency
      )}
      +
    </>
  );

  let statusColor = '';

  if (product.status === ProductStatus.DRAFT) {
    statusColor = `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
  } else if (product.status === ProductStatus.ARCHIVED) {
    statusColor = `bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
  } else if (product.status === ProductStatus.PUBLISHED) {
    statusColor = `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
  }

  return (
    <>
      <tr
        key={product.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <button
            className='hover:text-primary-400'
            onClick={() => setIsDrawerOpen(true)}
          >
            {product.title}
          </button>

          {/* Show Product Image on Hover */}
          {product.multimedia?.url && (
            <div className='absolute left-20 mt-2 w-32 h-32 bg-white border rounded-lg shadow-lg hidden group-hover:block z-[500]'>
              <Image
                src={product.multimedia.url}
                alt={product.title}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
          )}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {priceData}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {product.business_info.business_name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {product.category?.name || 'N/A'}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {product.type}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <span
            className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded`}
          >
            {product.status}
          </span>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(product.published_at).format('MMM D, YYYY')}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(product.created_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Product Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div
          className='space-y-4 text-gray-900
dark:text-white'
        >
          <h2 className='text-lg font-bold'>{product.title}</h2>

          {/* Product Image */}
          {product.multimedia?.url && (
            <div className='my-4'>
              <Image
                src={product.multimedia.url}
                alt={product.title}
                width={300}
                height={200}
                className='rounded-lg'
              />
            </div>
          )}

          <p
            dangerouslySetInnerHTML={{
              __html: product.description || '<i>No description available.</i>',
            }}
          ></p>

          {/* Product Details */}
          <div className='mt-4 space-y-2 text-sm'>
            <p>
              <strong>Price:</strong> {priceData}
            </p>
            <p>
              <strong>Category:</strong> {product.category?.name || 'N/A'}
            </p>
            <p>
              <strong>Type:</strong> {product.type}
            </p>
            <p>
              <strong>Business:</strong> {product.business_info.business_name}
            </p>
            <p>
              <strong>Creator:</strong> {product.creator.name}
            </p>
            <p>
              <strong>Status:</strong> {product.status}
            </p>
            <p>
              <strong>Published At:</strong>{' '}
              {moment(product.published_at).format('MMMM D, YYYY')}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {moment(product.created_at).format('MMMM D, YYYY')}
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ProductItem;
