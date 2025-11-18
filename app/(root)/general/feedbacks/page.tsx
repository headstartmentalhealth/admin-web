'use client';

import ActionConfirmation from '@/components/ActionConfirmation';
import DoughnutChart from '@/components/DoughnutChart';
import PageHeading from '@/components/PageHeading';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import { allTimeFeedbacks, feedbackTypes } from '@/lib/utils';
import { Modal } from 'flowbite-react';
import React, { useState } from 'react';
import { HiEye, HiTrash } from 'react-icons/hi';

const Feedbacks = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <main className='section-container'>
      <header>
        {/* Page Heading */}
        <PageHeading
          title='Feedbacks'
          enableBreadCrumb={true}
          layer2='General'
          layer3='Feedbacks'
        />

        {/* Filter */}
        <Filter searchPlaceholder='Search by feature' />
      </header>
      <section className='py-5'>
        <div className='flex flex-col-reverse lg:flex-row gap-4'>
          <div className='flex-1 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <h5 className='text-xl font-bold leading-none text-gray-900 dark:text-white'>
                All-time Feedbacks
              </h5>
            </div>
            <div className='flow-root mb-7'>
              <div className='relative overflow-x-auto'>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>
                        Feature
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        censored
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Date
                      </th>
                      <th scope='col' className='px-6 py-3'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTimeFeedbacks.map((feedback) => (
                      <tr
                        key={feedback.id}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                      >
                        <td className='px-6 py-4'>{feedback.feature}</td>
                        <td className='px-6 py-4 max-w-xs truncate'>
                          {feedback.censored}
                        </td>
                        <td className='px-6 py-4'>{feedback.date}</td>
                        <td className='px-6 py-4 flex'>
                          <button
                            type='button'
                            onClick={() => setOpenModal(true)}
                            className='primary-btn'
                          >
                            <HiEye />
                          </button>
                          <ActionConfirmation
                            action={<HiTrash />}
                            body='Are you sure you want to delete'
                            className='danger-btn'
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              paddingRequired={false}
              total={allTimeFeedbacks.length}
            />
          </div>
          <div className='flex flex-1'>
            <div className='flex-1 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <h5 className='text-xl font-bold leading-none text-gray-900 dark:text-white'>
                  Feedbacks Overview
                </h5>
              </div>
              <DoughnutChart title='Feedbacks' data={feedbackTypes} />

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
                    {feedbackTypes.map((type) => (
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
      <Modal
        show={openModal}
        size='md'
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className='space-y-6'>
            <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
              Original suggestion
            </h3>
            <div>
              <div className='mb-2 block'>
                <p>
                  Functionality is okay, but there are some bugs that need
                  fixing. It’s not as reliable as I hoped.
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Feedbacks;
