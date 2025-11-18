import { formatMoney, PaymentStatus, shortenId } from '@/lib/utils';
import React, { useState } from 'react';
import Drawer from '@/components/ui/Drawer'; // Import a drawer component

import moment from 'moment'; // Import moment.js
import { Transaction } from '@/types/payment';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PaymentItemProps {
  payment: Transaction;
}
const PaymentItem = ({ payment }: PaymentItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const params = useParams();

  const priceData = formatMoney(+payment.amount, payment.currency);

  let statusColor = '';

  if (payment.payment_status === PaymentStatus.PENDING) {
    statusColor = `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
  } else if (payment.payment_status === PaymentStatus.FAILED) {
    statusColor = `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
  } else if (payment.payment_status === PaymentStatus.SUCCESS) {
    statusColor = `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
  }

  let items = (in_table: boolean) => {
    let details = payment.purchase
      ? payment.purchase?.items.map((item) => (
          <li key={item.id} title={item.purchase_type}>
            {item.name} x {item.quantity}
            {!in_table && (
              <div className='ml-5 mt-2'>
                Type: {item.purchase_type}
                <br />
                Currency: {formatMoney(item.price, payment.currency)}
              </div>
            )}
          </li>
        ))
      : payment?.subscription_plan?.name;

    return details;
  };

  return (
    <>
      <tr
        key={payment.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <button
            className='hover:text-primary-400'
            onClick={() => setIsDrawerOpen(true)}
            title={payment.id}
          >
            {shortenId(payment.id)}
          </button>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {payment?.user?.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {items(true)}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {priceData}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <span
            className={`bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded`}
          >
            {payment.payment_method}
          </span>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <span
            className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded`}
          >
            {payment.payment_status}
          </span>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(payment.created_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Payment Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <section
          className='space-y-4 text-gray-900
dark:text-white'
        >
          <h2 className='text-lg font-bold'>#{shortenId(payment.id)}</h2>

          <p className='text-lg font-bold'>Items</p>
          {items(false)}

          <p className='text-lg font-bold'>Total</p>
          <span className='text-lg'>{priceData}</span>

          {/* Buyer's Details */}
          <div className='space-y-2'>
            <p>
              <strong>Name:</strong> {payment?.user?.name}
            </p>
            <p>
              <strong>Email Address:</strong> {payment?.user?.email}
              {payment?.user?.is_email_verified && '✅'}
            </p>

            <p>
              <strong>Account Creation Date:</strong>{' '}
              {moment(payment.created_at).format('MMMM D, YYYY')}
            </p>
          </div>

          {!params.id && (
            <div>
              <Link
                href={`/organizations/${
                  payment.subscription_plan?.business_id ||
                  payment.purchase?.business_id
                }/details`}
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

export default PaymentItem;
