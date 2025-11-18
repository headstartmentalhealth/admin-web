import Drawer from '@/components/ui/Drawer';
import {
  BusinessState,
  emailSplit,
  formatMoney,
  maskSensitiveData,
  shortenId,
} from '@/lib/utils';
import { Business, Customer } from '@/types/organization';
import moment from 'moment-timezone';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface CustomerItemProps {
  customer: Customer;
}
const CustomerItem = ({ customer }: CustomerItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  let purchases = customer.payments.length
    ? customer.payments.map((payment) => (
        <div key={payment.id} className='my-6 space-y-2'>
          <p className='font-bold'>Purchase ID: {shortenId(payment.id)}</p>
          {payment.purchase?.items.map((item, index) => (
            <ul key={index} className='mb-1'>
              <li>
                <span>Name: {item.name}</span>
              </li>
              <li>
                <span>
                  Price: {formatMoney(item.price, payment.currency)} (
                  {item.quantity})
                </span>
              </li>
              <li>
                <span>Type: {item.purchase_type}</span>
              </li>
              <li>
                <span>
                  Date Purchased:{' '}
                  {moment(payment.created_at).format('MMM D, YYYY')}
                </span>
              </li>
            </ul>
          ))}
          {payment.subscription_plan && (
            <ul>
              <li>Name: {payment.subscription_plan.name}</li>
              <li>Type: {payment.purchase_type}</li>
              <li>Interval: {payment.interval}</li>
              <li>
                Auto Renewal: {payment.auto_renew ? 'Activated' : 'Disabled'}
              </li>
              <li>Date: {moment(payment.created_at).format('MMM D, YYYY')}</li>
            </ul>
          )}
          <p>
            Discount Applied:{' '}
            {formatMoney(+payment.discount_applied, payment.currency)}{' '}
          </p>
          <p>Total: {formatMoney(+payment.amount, payment.currency)} </p>
        </div>
      ))
    : null;

  return (
    <>
      <tr
        key={customer.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
      >
        <th
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <button
            className='hover:text-primary-400'
            onClick={() => setIsDrawerOpen(true)}
          >
            {shortenId(customer.id)}
          </button>

          {/* Show Product Image on Hover */}
          <div className='absolute left-20 mt-2 w-[50] object-contain bg-white border rounded-lg shadow-lg hidden group-hover:block z-20'>
            {customer?.profile?.profile_picture ? (
              <Image
                src={customer?.profile?.profile_picture}
                width={100}
                height={100}
                objectFit='cover'
                className='rounded-lg'
                alt='logo'
              />
            ) : (
              <div className={`px-4 py-3 rounded-full bg-primary-main`}>
                <p className='text-white'>{customer.name[0]}</p>
              </div>
            )}
          </div>
        </th>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {customer.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {customer.email} {customer.is_email_verified && '✅'}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {customer.phone || 'N/A'}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {customer.role.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {customer.profile?.country_code || 'N/A'}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {moment(customer.created_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Product Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div
          className='space-y-4 text-gray-900
dark:text-white'
        >
          <h2 className='text-lg font-bold'>{customer.name}</h2>

          {/* Customer Profile Picture */}
          {customer.profile?.profile_picture && (
            <div className='my-4'>
              <Image
                src={customer.profile?.profile_picture}
                alt={customer.profile?.profile_picture}
                width={300}
                height={200}
                className='rounded-lg'
              />
            </div>
          )}

          {/* Customer Details */}
          <div className='mt-4 space-y-2 text-sm'>
            <p>
              <strong>Name:</strong> {customer.name}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}{' '}
              {customer.is_email_verified && '✅'}
            </p>
            <p>
              <strong>Phone:</strong> {customer?.phone || 'N/A'}
            </p>
            <p>
              <strong>Role:</strong> {customer.role.name || 'N/A'}
            </p>
            <p>
              <strong>Country:</strong>{' '}
              {customer.profile?.country_code || 'N/A'}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {moment(customer.created_at).format('MMMM D, YYYY')}
            </p>
            <div>{purchases}</div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
export default CustomerItem;
