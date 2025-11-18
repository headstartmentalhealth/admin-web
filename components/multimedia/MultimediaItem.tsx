import { shortenId } from '@/lib/utils';
import React, { useState } from 'react';
import Drawer from '@/components/ui/Drawer'; // Import a drawer component

import moment from 'moment'; // Import moment.js
import Link from 'next/link';
import { MediaDetails } from '@/types/multimedia';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface MultimediaItemProps {
  multimedia: MediaDetails;
}
const MultimediaItem = ({ multimedia }: MultimediaItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const params = useParams();

  return (
    <>
      <tr
        key={multimedia.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <button
            className='hover:text-primary-400'
            onClick={() => setIsDrawerOpen(true)}
            title={multimedia.id}
          >
            {shortenId(multimedia.id)}
          </button>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'>
          <div className='w-72 truncate'>
            <a
              href={multimedia.url}
              target='blank'
              className='text-primary-400 hover:underline '
            >
              {multimedia.url}
            </a>
          </div>
          {/* Show Product Image on Hover */}
          {multimedia?.url && (
            <div className='absolute left-20 mt-2 w-32 h-32 bg-white border rounded-lg shadow-lg hidden group-hover:block z-[500]'>
              <Image
                src={multimedia.url}
                alt={multimedia.id}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
          )}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold truncate'>
          {multimedia.type}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {multimedia.provider}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {multimedia.creator.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {multimedia?.business_info?.business_name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(multimedia.created_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Payment Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <section
          className='space-y-4 text-gray-900
dark:text-white'
        >
          <h2 className='text-lg font-bold'>#{shortenId(multimedia.id)}</h2>

          <div className='space-y-2'>
            <p>
              <strong>ID:</strong> {multimedia.id}
            </p>
            <p className='truncate'>
              <strong>URL:</strong>{' '}
              <a
                href={multimedia.url}
                target='blank'
                className='text-primary-400 hover:underline'
              >
                {multimedia.url}
              </a>
            </p>
            <p>
              <strong>Type:</strong> {multimedia.type}
            </p>
            <p>
              <strong>Provider:</strong> {multimedia.provider}
            </p>
            <p>
              <strong>Creator:</strong> {multimedia.creator.name}
            </p>
            <p>
              <strong>Organization:</strong>{' '}
              {multimedia?.business_info?.business_name}
            </p>
            <p>
              <strong>Date Created:</strong>{' '}
              {moment(multimedia.created_at).format('MMMM D, YYYY')}
            </p>
          </div>

          {!params.id && (
            <div>
              <Link
                href={`/organizations/${multimedia?.business_id}/details`}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
              >
                View business
              </Link>
            </div>
          )}
        </section>
      </Drawer>
    </>
  );
};

export default MultimediaItem;
