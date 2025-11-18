import { ContactStatus } from '@/lib/utils';
import { ContactAccount } from '@/types/organization';
import { capitalize } from 'lodash';
import moment from 'moment-timezone';
import Link from 'next/link';
import React from 'react';

interface ContactItemProps {
  contact: ContactAccount;
}
const ContactItem = ({ contact }: ContactItemProps) => {
  return (
    <>
      <tr
        key={contact.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
      >
        <th
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          {contact.name}
        </th>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {contact.email}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {contact.is_owner ? 'Owner' : 'Member'}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white '>
          <span
            className={`px-2 py-1 rounded-md text-sm ${
              contact.status === ContactStatus.ACTIVE
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {capitalize(contact.status)}
          </span>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {contact.expires_at
            ? moment(contact.expires_at).format('MMM D, YYYY')
            : 'N/A'}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {moment(contact.created_at).format('MMM D, YYYY')}
        </td>
      </tr>
    </>
  );
};

export default ContactItem;
