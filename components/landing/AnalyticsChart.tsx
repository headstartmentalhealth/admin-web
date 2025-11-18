// components/AnalyticsChart.tsx
'use client';

import { formatMoney } from '@/lib/utils';
import { RevenueReport } from '@/types/analytics';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { month: 'Jan', profit: 400, expenses: 200 },
  { month: 'Feb', profit: 600, expenses: 300 },
  { month: 'Mar', profit: 700, expenses: 400 },
  { month: 'Apr', profit: 800, expenses: 500 },
  { month: 'May', profit: 900, expenses: 600 },
  { month: 'Jun', profit: 500, expenses: 300 },
  { month: 'Jul', profit: 600, expenses: 400 },
  { month: 'Aug', profit: 700, expenses: 500 },
  { month: 'Sep', profit: 800, expenses: 600 },
  { month: 'Oct', profit: 1100, expenses: 700 },
  { month: 'Nov', profit: 1200, expenses: 800 },
  { month: 'Dec', profit: 1300, expenses: 900 },
];

interface AnalyticsChartProps {
  revenue: RevenueReport;
}
const AnalyticsChart = ({ revenue }: AnalyticsChartProps) => {
  const data = revenue?.monthly_breakdown?.map((revenue_data) => ({
    month: revenue_data.month,
    users: parseFloat(revenue_data.product_revenue.replace(/[^0-9.-]+/g, '')),
    // subscriptions: parseFloat(
    //   revenue_data.subscription_revenue.replace(/[^0-9.-]+/g, '')
    // ),
    // withdrawals: parseFloat(revenue_data.withdrawals.replace(/[^0-9.-]+/g, '')),
  }));

  // Currency formatter function
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN', // Change to your preferred currency
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className='rounded-xl'>
      <div className='flex justify-between items-center gap-4'>
        <h3 className='text-lg font-semibold'>Onboarding Analytics</h3>

        <form>
          <select
            id='countries'
            className='w-40 bg-gray-50 border border-gray-300 dark:text-white text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 
      dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500'
            defaultValue='today'
          >
            {['Yearly'].map((value) => (
              <option key={value} value={value.toLowerCase()}>
                {value}
              </option>
            ))}
          </select>
        </form>
      </div>
      {/* Placeholder for chart */}
      <div className='mt-10'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            className='text-gray-800'
          >
            <XAxis dataKey='month' />
            <YAxis
              tickFormatter={formatCurrency}
              width={80} // Adjust width to accommodate currency symbols
            />
            <Tooltip
              formatter={(value) => formatMoney(Number(value))}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar dataKey='users' fill='#FF6B6B' name='Users' />
            {/* <Bar dataKey='subscriptions' fill='#4DD0E1' name='Subscriptions' />
            <Bar dataKey='withdrawals' fill='#FBC02D' name='Withdrawals' /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
