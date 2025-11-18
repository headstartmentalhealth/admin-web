'use client';

import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { useRef, useState } from 'react';

import PageHeading from '@/components/PageHeading';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import { suggestions } from '@/lib/utils';
import React from 'react';
import { HiDuplicate, HiEye, HiTrash } from 'react-icons/hi';
import ActionConfirmation from '@/components/ActionConfirmation';

const Suggestions = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <main>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading
          enableBreadCrumb={true}
          layer2='General'
          layer3='Suggestions'
        />

        {/* Filter */}
        <Filter pageTitle='Suggestions' showSearch={false} />
      </header>
      <section className='section-container-padding-0'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 min-w-full divide-y '>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Suggestion
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Date
                  </th>
                  <th scope='col' className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((suggestion) => (
                  <tr
                    key={suggestion.id}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                  >
                    <td className='px-6 py-4 max-w-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-white font-bold'>
                      {suggestion.censored}
                    </td>
                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {suggestion.date}
                    </td>

                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      <button
                        type='button'
                        onClick={() => setOpenModal(true)}
                        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                      >
                        <HiEye />
                      </button>
                      <ActionConfirmation
                        action={<HiTrash />}
                        body='Are you sure you want to delete'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <Pagination total={suggestions.length} />
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

export default Suggestions;
