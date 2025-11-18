import DoughnutChart from '@/components/DoughnutChart';
import PageHeading from '@/components/PageHeading';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import { ratingTypes } from '@/lib/utils';
import React from 'react';

const Ratings = () => {
  return (
    <main className='section-container'>
      <header>
        {/* Page Heading */}
        <PageHeading
          // title='Ratings'
          enableBreadCrumb={true}
          layer2='General'
          layer3='Ratings'
        />

        {/* Filter */}
        <Filter pageTitle='Ratings' showSearch={false} />
      </header>
      <section className='py-5'>
        <div className='flex flex-col-reverse lg:flex-row gap-4'>
          <div className='flex-1 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <h5 className='text-xl font-bold leading-none text-gray-900 dark:text-white'>
                All-time Ratings
              </h5>
            </div>
            <div className='flow-root mb-7'>
              <ul
                role='list'
                className='divide-y divide-gray-200 dark:divide-gray-700'
              >
                {
                  // allTmeRatings.map((rating) => (
                  //   <li key={rating.id} className='py-3 sm:py-4'>
                  //     <div className='flex gap-2 items-center'>
                  //       <div className='flex-1 min-w-0'>
                  //         <p className='text-base font-medium text-gray-900 truncate dark:text-white'>
                  //           {rating.rating}
                  //         </p>
                  //       </div>
                  //       <div className='flex-1 text-gray-900 dark:text-white'>
                  //         {rating.date}
                  //       </div>
                  //       <div className='text-sm text-gray-900 dark:text-white'>
                  //         <ActionConfirmation
                  //           action={<HiTrash />}
                  //           body='Are you sure you want to delete'
                  //           className='danger-btn mt-2'
                  //         />
                  //       </div>
                  //     </div>
                  //   </li>
                  // ))
                }
              </ul>
            </div>
            <Pagination paddingRequired={false} total={[].length} />
          </div>
          <div className='flex flex-1 items-stretch flex-col'>
            <div className='flex-1 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <h5 className='text-xl font-bold leading-none text-gray-900 dark:text-white'>
                  Ratings Overview
                </h5>
              </div>
              <DoughnutChart title='Ratings' data={ratingTypes} />

              <div className='relative overflow-x-auto'>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>
                        Rating
                      </th>
                      <th scope='col' className='px-6 py-3 text-right'>
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingTypes.map((type) => (
                      <tr
                        key={type.type}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                      >
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          {type.type}
                        </th>
                        <td className='px-6 py-4 text-right'>{type.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Ratings;
