'use client';

import DoughnutChart from '@/components/DoughnutChart';
import AnalyticsChart from '@/components/landing/AnalyticsChart';
import useMetrics from '@/hooks/page/useMetrics';
import useConnections from '@/hooks/page/useConnections';
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
  const { connections, connectionsLoading } = useConnections(true, 36000);
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
              { label: 'Affirmatives', value: metrics?.total_affirmative_contents || 0 },
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

          {/* Graph & Real-Time Connections */}
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

            {/* Real-time Connections Monitoring Card */}
            <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-md lg:col-span-2 flex flex-col justify-between'>
              <div>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold flex items-center gap-2'>
                    Real-Time Connection Center
                    <span className='relative flex h-2.5 w-2.5'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500'></span>
                    </span>
                  </h3>
                  <span className='text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 animate-pulse'>
                    Live Monitoring
                  </span>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  Active traffic monitoring of API gateways, HTTP concurrent connections, and real-time WebSocket sessions.
                </p>

                <div className='grid grid-cols-3 gap-4 mt-6'>
                  <div className='bg-violet-50 dark:bg-violet-950/20 p-4 rounded-lg text-center border border-violet-100 dark:border-violet-900/30'>
                    <p className='text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider'>Total Live</p>
                    <p className='text-3xl font-extrabold text-violet-700 dark:text-violet-300 mt-2 animate-bounce'>
                      {connectionsLoading ? '...' : (connections?.totalActive ?? 0)}
                    </p>
                  </div>
                  <div className='bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg text-center border border-emerald-100 dark:border-emerald-900/30'>
                    <p className='text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider'>Active HTTP</p>
                    <p className='text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-2'>
                      {connectionsLoading ? '...' : (connections?.activeHttp ?? 0)}
                    </p>
                  </div>
                  <div className='bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg text-center border border-amber-100 dark:border-amber-900/30'>
                    <p className='text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider'>Active WS</p>
                    <p className='text-3xl font-extrabold text-amber-700 dark:text-amber-300 mt-2'>
                      {connectionsLoading ? '...' : (connections?.activeWs ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400'>
                <div>
                  <span className='font-semibold text-gray-700 dark:text-gray-300'>Lifetime API Requests:</span>{' '}
                  {connectionsLoading ? '...' : (connections?.totalHttp ?? 0)}
                </div>
                <div>
                  <span className='font-semibold text-gray-700 dark:text-gray-300'>Lifetime WS Connections:</span>{' '}
                  {connectionsLoading ? '...' : (connections?.totalWs ?? 0)}
                </div>
              </div>
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
                        <th scope='col' className='px-6 py-3'>Status</th>
                        <th scope='col' className='px-6 py-3'>Date Joined</th>
                        <th scope='col' className='px-6 py-3'>Action</th>

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