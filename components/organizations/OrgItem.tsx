import { BusinessState, emailSplit, maskSensitiveData } from '@/lib/utils';
import { Business } from '@/types/organization';
import moment from 'moment-timezone';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface OrgItemProps {
  type: BusinessState;
  organization: Business;
  isDeleted?: boolean;
}
const OrgItem = ({ type, organization, isDeleted }: OrgItemProps) => {
  return (
    <>
      <tr
        key={organization.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
      >
        <th
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          {isDeleted ? (
            <span className='hover:text-primary-400'>
              {organization.business_name}
            </span>
          ) : (
            <Link
              href={`/organizations/${organization.id}/details`}
              className='hover:text-primary-400'
            >
              {organization.business_name}
            </Link>
          )}

          {/* Show Product Image on Hover */}
          {organization.logo_url && (
            <div className='absolute left-20 mt-2 w-[50] object-contain bg-white border rounded-lg shadow-lg hidden group-hover:block z-20'>
              {organization.logo_url ? (
                <Image
                  src={organization.logo_url}
                  width={100}
                  height={100}
                  objectFit='cover'
                  className='rounded-lg'
                  alt='logo'
                />
              ) : (
                <div
                  className={`px-4 py-3 rounded-full`}
                  style={{ backgroundColor: 'blue' }}
                >
                  <p className='text-white'>{organization.business_name[0]}</p>
                </div>
              )}
            </div>
          )}
        </th>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {organization.user.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {organization.user.email}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {organization.industry}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {organization.country_code}
        </td>
        {type === BusinessState.registered && (
          <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
            {organization.user.is_suspended ? (
              <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'>
                Suspended
              </span>
            ) : (
              <span className='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>
                Active
              </span>
            )}
          </td>
        )}
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {moment(organization.created_at).format('MMM D, YYYY')}
        </td>
      </tr>
    </>
  );
};
export default OrgItem;
