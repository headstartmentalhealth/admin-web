import Badge from '@/components/ui/SystemBadge';
import {
  getColor,
  NOTIFICATION_STATUS,
  NotificationKind,
  shortenId,
} from '@/lib/utils';
import {
  InstantNotification,
  ScheduledNotification,
} from '@/types/notification';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import ActionDropdown from '../../ActionDropdown';
import moment from 'moment-timezone';
import Drawer from '@/components/ui/Drawer';
import Link from 'next/link';
import Image from 'next/image';

interface ScheduledNotificationItemProps {
  notification: ScheduledNotification;
}
const ScheduledNotificationItem = ({
  notification,
}: ScheduledNotificationItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sender = notification.owner
    ? `${notification.owner?.name} (${shortenId(notification.owner?.id!)})`
    : notification.business
    ? `${notification.business?.business_name} (${shortenId(
        notification.business?.id!
      )})`
    : 'N/A';

  const status = notification.schedule_info?.status;

  return (
    <tr
      key={notification.id}
      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
    >
      <td className='px-6 py-4 max-w-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-white font-bold'>
        <button
          className='hover:text-primary-400'
          onClick={() => setIsDrawerOpen(true)}
          title={notification.id}
        >
          {notification.title}
        </button>
      </td>
      <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        {sender}
      </td>
      <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        {moment(notification.schedule_info?.scheduled_time).format(
          'MMMM D, YYYY HH:MM'
        )}
      </td>
      <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        <Badge
          color={getColor(notification.schedule_info?.status!)!}
          text={capitalize(status)}
        />
      </td>
      <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        {moment(notification.created_at).format('MMMM D, YYYY')}
      </td>

      <td className='flex px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        <ActionDropdown
          id={notification.id}
          status={notification.schedule_info?.status.toLocaleLowerCase() as any}
          notificationType={notification.type}
        />
      </td>

      {/* Notification Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <section
          className='space-y-4 text-gray-900
dark:text-white '
        >
          <h2 className='text-lg font-bold'>{notification.title}</h2>

          <div className='border border-dashed rounded-lg'>
            <div className='space-y-6 p-4 rounded-lg shadow sm:p-6 md:p-8 w-full'>
              <div className='flex flex-col items-center justify-center pt-2 mx-auto pt:mt-0 '>
                <a
                  href='#'
                  className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white'
                >
                  <Image
                    src={'/logo.png'}
                    width={150}
                    height={150}
                    alt='Logo'
                    className='m-auto block dark:hidden'
                    priority
                  />
                  <Image
                    src={'/logo-white.png'}
                    width={150}
                    height={150}
                    alt='Logo'
                    className='m-auto hidden dark:block'
                    priority
                  />
                </a>
                <div
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                />
              </div>
            </div>
          </div>

          {/* Composed by */}
          <div className='space-y-2'>
            {notification.owner?.name ||
              (notification.business?.business_name && (
                <p>
                  <strong>Name:</strong>{' '}
                  {notification.owner?.name ||
                    notification.business?.business_name}
                </p>
              ))}

            <p>
              <strong>Creation Date:</strong>{' '}
              {moment(notification.created_at).format('MMMM D, YYYY')}
            </p>
          </div>

          {notification.business_id && (
            <div>
              <Link
                href={`/organizations/${notification?.business_id}/details`}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
              >
                View business
              </Link>
            </div>
          )}
        </section>
      </Drawer>
    </tr>
  );
};

export default ScheduledNotificationItem;
