'use client';

import DoughnutChart from '@/components/DoughnutChart';
import AnalyticsChart from '@/components/landing/AnalyticsChart';
import useMetrics from '@/hooks/page/useMetrics';
import useProductCount from '@/hooks/page/useProductCount';
import useRevenue from '@/hooks/page/useRevenue';
import React from 'react';

const Home = () => {
  const { metrics, metricsLoading } = useMetrics();
  const { revenue, revenuesLoading } = useRevenue();
  const { productCount, productCountLoading } = useProductCount();

  // Prepare the data for the doughnut chart
  const doughnutData = productCount
    ? [
        {
          type: 'Courses',
          count: productCount.course,
          color: '#A78BFA',
        },
        {
          type: 'Tickets',
          count: productCount.ticket,
          color: '#F59E0B',
        },
      ]
    : [];

  // Shimmer loading component
  const Shimmer = ({ className }: { className: string }) => (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    ></div>
  );

  return (
    <main className='section-container'>
      <div className='flex h-screen'>
        {/* Main Content */}
        <main className='flex-1 p-6 text-black-1 dark:text-white'>
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
              {
                label: 'Registered Users',
                value: metrics?.total_organizations,
                change: '',
              },
              { label: 'Library Materials', value: 0, change: '' },
              {
                label: 'Audio Contents',
                value: 0,
                change: '',
              },
              {
                label: 'Posts',
                value: 0,
                change: '',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-800 p-4 rounded-md shadow-md'
              >
                <h3 className='text-gray-600 dark:text-white'>{stat.label}</h3>
                {metricsLoading ? (
                  <Shimmer className='w-3/4 h-6 mt-2' />
                ) : (
                  <div className='flex gap-2 items-center'>
                    <p className='text-xl font-bold'>{stat.value}</p>
                    <span
                      className={
                        stat.change.includes('-')
                          ? 'text-red-500'
                          : 'text-green-500'
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Graph & Map */}
          <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-md lg:col-span-2'>
              {revenuesLoading ? (
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <Shimmer className='w-32 h-6' />
                    <Shimmer className='w-40 h-8' />
                  </div>
                  <Shimmer className='w-full h-64' />
                </div>
              ) : (
                <AnalyticsChart revenue={revenue!} />
              )}
            </div>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-md'>
              <h3 className='text-lg font-semibold'>Resources Overview</h3>
              {productCountLoading ? (
                <div className='mt-4'>
                  <Shimmer className='w-full h-64 rounded-full' />
                </div>
              ) : (
                <DoughnutChart title='Resources Overview' data={doughnutData} />
              )}
            </div>
          </div>
        </main>
      </div>
    </main>
  );
};

export default Home;
