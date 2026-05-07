'use client';

import DoughnutChart from '@/components/DoughnutChart';
import AnalyticsChart from '@/components/landing/AnalyticsChart';
import useMetrics from '@/hooks/page/useMetrics';
import useOrgs from '@/hooks/page/useOrgs';
import useProductCount from '@/hooks/page/useProductCount';
import useResourceCount from '@/hooks/page/useResourceCount';
import useRevenue from '@/hooks/page/useRevenue';
import useCustomers from '@/hooks/page/useCustomers';
import TableEndRecord from '@/components/ui/TableEndRecord';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import CustomerItem from '@/components/organizations/customers/CustomerItem';
import { switchToOrg } from '@/redux/slices/organizationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { SystemRole } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { metrics, metricsLoading } = useMetrics();
  const { resourceCount, resourceCountLoading } = useResourceCount();
  const { organizations: orgs, loading: orgLoading } = useOrgs();
  const { organization: org } = useSelector((state: RootState) => state.organization);

  const {
    customers,
    loading: customersLoading,
  } = useCustomers({ role: SystemRole.USER });

  // Only the 10 most recent signups on the dashboard
  const recentCustomers = customers.slice(0, 10);

  const doughnutData = resourceCount
    ? [
      { type: 'Library Resources', count: resourceCount.library, color: '#A78BFA' },
      { type: 'Affirmatives', count: resourceCount.affirmative, color: '#A78BFA' },
      { type: 'Podcasts', count: resourceCount.podcast, color: '#A78BFA' },
    ]
    : [];

  const Shimmer = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );

  const handleSelectOrg = (orgId: string) => {
    dispatch(switchToOrg({ business_id: orgId }));
  };

  useEffect(() => {
    if (!org && orgs.length > 0) {
      handleSelectOrg(orgs[0].id);
    }
  }, [org, orgs]);

  return (
    <main className='section-container'>
      <div className='flex  overflow-y-hidden'>
        <main className='flex-1 p-6 text-black-1 dark:text-white overflow-y-auto scrollbar-hide'>
          {/* Header */}
          <header className='flex justify-between items-center'>
            {metricsLoading ? (
              <Shimmer className='w-48 h-8' />
            ) : (
              <h2 className='text-2xl font-semibold'>Hello, Admin 👋🏼</h2>
            )}
          </header>

          {/* Stats */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            {[
              { label: 'Registered Users', value: metrics?.total_organizations },
              { label: 'Library Materials', value: metrics?.total_library_materials || 0 },
              { label: 'Audio Contents', value: metrics?.total_audio_contents || 0 },
              { label: 'Blog Posts', value: metrics?.total_blog_posts || 0 },
            ].map((stat, index) => (
              <div key={index} className='bg-white dark:bg-gray-800 p-4 rounded-md shadow-md'>
                <h3 className='text-gray-600 dark:text-white'>{stat.label}</h3>
                {metricsLoading ? (
                  <Shimmer className='w-3/4 h-6 mt-2' />
                ) : (
                  <p className='text-xl font-bold mt-1'>{stat.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Graph */}
          <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-md'>
              <h3 className='text-lg font-semibold'>Resources Overview</h3>
              {resourceCountLoading ? (
                <div className='mt-4'>
                  <Shimmer className='w-full h-64 rounded-full' />
                </div>
              ) : (
                <DoughnutChart title='Resources Overview' data={doughnutData} />
              )}
            </div>
          </div>

          {/* Recent Signups */}
          <section className='mt-8'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-lg font-semibold'>Recent Signups</h3>
              <a
                href='/users'
                className='text-sm text-violet-600 dark:text-violet-400 hover:underline'
              >
                View all →
              </a>
            </div>

            <div className='overflow-x-auto rounded-none'>
              <div className='relative overflow-x-auto'>
                {customersLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                      <tr>
                        <th scope='col' className='px-6 py-3'>ID</th>
                        <th scope='col' className='px-6 py-3'>Name</th>
                        <th scope='col' className='px-6 py-3'>Email</th>
                        <th scope='col' className='px-6 py-3'>Phone</th>
                        <th scope='col' className='px-6 py-3'>Role</th>
                        <th scope='col' className='px-6 py-3'>Country</th>
                        <th scope='col' className='px-6 py-3'>Date Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCustomers.map((customer) => (
                        <CustomerItem key={customer.id} customer={customer} />
                      ))}

                      {!recentCustomers.length && (
                        <TableEndRecord colspan={7} text='No recent signups found.' />
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>


          </section>
        </main>
      </div>
    </main>
  );
};

export default Home;