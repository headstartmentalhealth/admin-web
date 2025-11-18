import { BusinessDetails } from '@/types/organization';
import moment from 'moment-timezone';
import Image from 'next/image';
import React from 'react';

interface OrgOverviewProps {
  organization: BusinessDetails | null;
}
const OrgOverview = ({ organization }: OrgOverviewProps) => {
  return (
    <div className='rounded-xl shadow-lg mx-auto'>
      <h2 className='text-3xl font-bold mb-8 border-b pb-2'>
        Organization Overview
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {/* Overview */}
        <div>
          <div className='flex flex-col mb-6'>
            {organization?.logo_url && (
              <Image
                src={organization?.logo_url!}
                width={150}
                height={150}
                objectFit='cover'
                alt='Organization Logo'
                className='rounded-lg border border-gray-300'
              />
            )}
          </div>

          <div className='grid grid-cols-1 gap-3'>
            <p>
              <strong>Business name:</strong>{' '}
              {organization?.business_name || 'N/A'}
            </p>
            <p>
              <strong>Industry:</strong> {organization?.industry || 'N/A'}
            </p>
            <p>
              <strong>Location:</strong> {organization?.location || 'N/A'}
            </p>
            <p>
              <strong>Working hours:</strong>{' '}
              {organization?.working_hours || 'N/A'}
            </p>
            <p>
              <strong>Business size:</strong>{' '}
              {organization?.business_size || 'N/A'}
            </p>
            <p>
              <strong>State:</strong> {organization?.state || 'N/A'}
            </p>
            <p>
              <strong>Country:</strong> {organization?.country_code || 'N/A'}
            </p>
            <p>
              <strong>Date Created:</strong>{' '}
              {moment(organization?.created_at).format('LLL') || 'N/A'}
            </p>
          </div>
        </div>

        {/* Withdrawal Account */}
        <div>
          <h3 className='text-2xl font-semibold mb-4 border-b pb-2'>
            Withdrawal Account
          </h3>
          <div className='grid grid-cols-1 gap-3'>
            <p>
              <strong>Account Number:</strong>{' '}
              {organization?.withdrawal_account?.account_number || 'N/A'}
            </p>
            <p>
              <strong>Account Type:</strong>{' '}
              {organization?.withdrawal_account?.account_type || 'N/A'}
            </p>
            <p>
              <strong>Country:</strong>{' '}
              {organization?.withdrawal_account?.country_code || 'N/A'}
            </p>
            <p>
              <strong>Currency:</strong>{' '}
              {organization?.withdrawal_account?.currency || 'N/A'}
            </p>
            <p>
              <strong>Bank Name:</strong>{' '}
              {organization?.withdrawal_account?.bank_name || 'N/A'}
            </p>
            <p>
              <strong>Routing Number:</strong>{' '}
              {organization?.withdrawal_account?.routing_number || 'N/A'}
            </p>
          </div>
        </div>

        {/* Billing Details */}
        <div>
          <h3 className='text-2xl font-semibold mb-4 border-b pb-2'>
            Billing Details
          </h3>
          <p className=' italic'>No billing details available.</p>
        </div>
      </div>
    </div>
  );
};

export default OrgOverview;
