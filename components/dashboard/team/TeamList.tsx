'use client';

import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
import { cn, ContactInviteStatus, getAvatar } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { capitalize } from 'lodash';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { ContactInvite } from '@/types/organization';
import { Profile } from '@/types/account';

interface TeamMemberRowProps {
  member: ContactInvite;
  index: number;
  profile: Profile | null;
}

const TeamMemberRow = ({ member, index, profile }: TeamMemberRowProps) => {

  const isSelf = (member.user?.id === profile?.id) && member.is_owner;
  const href = isSelf ? '#' : `/teams/${member.id}`;
  const editHref = (member.user?.id === profile?.id) ? '#' : `/team/${member.id}`;

  const statusStyles: Record<ContactInviteStatus, string> = {
    [ContactInviteStatus.ACTIVE]: 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400',
    [ContactInviteStatus.SUSPENDED]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400',
    [ContactInviteStatus.PENDING]: 'bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400',
    [ContactInviteStatus.EXPIRED]: 'bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-400',
  };

  const roleStyles = member.is_owner
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400'
    : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300';

  return (
    <tr className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
      <td className='px-4 py-4 font-medium text-gray-800 dark:text-gray-100'>
        <Link href={href} className={cn(isSelf && 'cursor-default')}>
          {index + 1}
        </Link>
      </td>
      <td className='px-4 py-3'>
        <Link
          href={editHref}
          className={cn('flex items-center gap-3 pr-3', isSelf && 'cursor-default')}
        >
          <img
            src={getAvatar(member.user?.profile?.profile_picture!, member.name)}
            alt={member.name}
            className='w-8 h-8 rounded-full object-cover'
          />
          <div
            className={cn(
              'flex items-center gap-1 underline underline-offset-4 dark:text-gray-200',
              isSelf && 'no-underline'
            )}
          >
            <span className='font-medium text-gray-800 dark:text-gray-100 truncate'>
              {isSelf ? 'You' : member.name || '-'}
            </span>
            {!isSelf && <PencilIcon size='13' />}
          </div>
        </Link>
      </td>
      <td className='px-4 py-2 text-gray-600 dark:text-gray-300 truncate max-w-[200px]'>
        {member.email}
      </td>
      <td className='px-4 py-2'>
        <span className='inline-flex items-center gap-1 text-gray-700 dark:text-gray-200'>
          {member.is_owner && <MdOutlineAdminPanelSettings className='text-blue-500' />}
          <span className={cn('font-medium px-2 py-1 rounded-full', roleStyles)}>
            {member.is_owner ? 'Admin' : 'Member'}
          </span>
        </span>
      </td>
      <td className='px-4 py-2'>
        <span
          className={cn(
            'font-medium px-2 py-1 rounded-full',
            statusStyles[member.status as keyof typeof statusStyles]
          )}
        >
          {capitalize(member.status)}
        </span>
      </td>
    </tr>
  );
};

const TeamList = ({ loading }: { loading: boolean }) => {
  const { invites, count } = useSelector((state: RootState) => state.organization);
  const { profile } = useSelector((state: RootState) => state.auth);

  const noFoundText = !count ? 'No record found.' : undefined;

  return (
    <section className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'>
      <table className='min-w-full text-sm text-left'>
        <thead className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold tracking-wide'>
          <tr>
            <th className='p-4'>ID</th>
            <th className='p-4'>Name</th>
            <th className='p-4'>Email</th>
            <th className='p-4'>Role</th>
            <th className='p-4'>Status</th>
          </tr>
        </thead>

        {loading ? (
          <LoadingSkeleton length={12} columns={5} />
        ) : (
          <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
            {invites.map((member, index) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                index={index}
                profile={profile}
              />
            ))}
            {!invites.length && <TableEndRecord colspan={7} text={noFoundText} />}
          </tbody>
        )}
      </table>
    </section>
  );
};

export default TeamList;

