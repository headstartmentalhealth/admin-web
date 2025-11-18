import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ContactAccount } from '@/types/organization';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import ContactItem from './ContactItem';
import TableEndRecord from '@/components/ui/TableEndRecord';
import Pagination from '@/components/Pagination';

interface ContactListProps {
  contacts: ContactAccount[];
  count: number;
  onClickNext: () => void;
  onClickPrev: () => void;
  currentPage: number;
  loading: boolean;
}
const ContactList = ({
  contacts,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: ContactListProps) => {
  const searchParams = useSearchParams();
  if (loading) return <LoadingSkeleton />;

  const noFoundText = !count ? 'No record found.' : undefined;

  return (
    <div className='overflow-x-auto rounded-none'>
      <div className='relative overflow-x-auto'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Email
              </th>
              <th scope='col' className='px-6 py-3'>
                Role
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3'>
                Invitation Expiry
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}

            {!contacts.length && (
              <TableEndRecord colspan={6} text={noFoundText} />
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          total={count}
          currentPage={currentPage}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          noMoreNextPage={contacts.length === 0}
        />
      </div>
    </div>
  );
};

export default ContactList;
