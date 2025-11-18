import { formatMoney, PaymentStatus, shortenId } from '@/lib/utils';
import React, { useState } from 'react';
import Drawer from '@/components/ui/Drawer'; // Import a drawer component

import moment from 'moment'; // Import moment.js
import { Transaction } from '@/types/payment';
import Link from 'next/link';
import { SubscriptionPlan } from '@/types/subscription-plan';
import { capitalize } from 'lodash';
import { useParams } from 'next/navigation';

interface SubscriptionPlanItemProps {
  subscription_plan: SubscriptionPlan;
}
const SubscriptionPlanItem = ({
  subscription_plan,
}: SubscriptionPlanItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const params = useParams();

  let pricing = subscription_plan.subscription_plan_prices.length
    ? subscription_plan.subscription_plan_prices.map((plan_price) => (
        <li key={plan_price.id}>
          {capitalize(plan_price.period)} -{' '}
          {formatMoney(+plan_price.price, plan_price.currency)}
        </li>
      ))
    : 'N/A';

  let roles = subscription_plan.subscription_plan_roles.length
    ? subscription_plan.subscription_plan_roles.map((plan_role) => (
        <li key={plan_role.id}>
          {capitalize(plan_role.title)} {plan_role.selected && '✅'}
        </li>
      ))
    : 'N/A';

  return (
    <>
      <tr
        key={subscription_plan.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <button
            className='hover:text-primary-400'
            onClick={() => setIsDrawerOpen(true)}
            title={subscription_plan.id}
          >
            {shortenId(subscription_plan.id)}
          </button>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {subscription_plan.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {subscription_plan.creator.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {subscription_plan.business.business_name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {pricing}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {roles}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(subscription_plan.created_at).format('MMM D, YYYY')}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(subscription_plan.updated_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Payment Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <section
          className='space-y-4 text-gray-900
dark:text-white'
        >
          <h2 className='text-lg font-bold'>
            #{shortenId(subscription_plan.id)}
          </h2>

          <p className='text-lg font-bold'>Pricing</p>
          {pricing}

          <p className='text-lg font-bold'>Role(s)</p>
          {roles}

          <div className='space-y-2'>
            <p>
              <strong>ID:</strong> {subscription_plan.id}
            </p>
            <p>
              <strong>Name:</strong> {subscription_plan.name}
            </p>
            <p>
              <strong>Creator:</strong> {subscription_plan.creator.name}
            </p>
            <p>
              <strong>Organization:</strong>{' '}
              {subscription_plan.business.business_name}
            </p>
            <p>
              <strong>Date Created:</strong>{' '}
              {moment(subscription_plan.created_at).format('MMMM D, YYYY')}
            </p>
            <p>
              <strong>Date Updated:</strong>{' '}
              {moment(subscription_plan.updated_at).format('MMMM D, YYYY')}
            </p>
          </div>

          {!params.id && (
            <div>
              <Link
                href={`/organizations/${subscription_plan?.business_id}/details`}
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

export default SubscriptionPlanItem;
