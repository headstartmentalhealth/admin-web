import { cn, formatMoney, getAvatar, shortenId } from '@/lib/utils';
import { Withdrawal } from '@/types/withdrawal';
import moment from 'moment-timezone';
import Link from 'next/link';
import React from 'react';
import { PencilIcon } from 'lucide-react';

interface WithdrawalItemProps {
    txn: Withdrawal;
    idx: number;
}

const WithdrawalItem = ({ txn, idx }: WithdrawalItemProps) => {
    const isEvenRow = idx % 2 === 0;
    const rowClasses = cn(
        'border-b dark:border-gray-700',
        isEvenRow ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
    );

    const business = txn.business;
    const logo = business?.logo_url;
    const displayAvatar = logo || business?.business_name;

    return (
        <tr key={txn.id} className={rowClasses}>
            {/* Date */}
            <td className="px-6 py-2 min-w-[140px] text-sm">
                {moment(txn.created_at).format('lll')}
            </td>

            {/* Withdrawal ID */}
            <td className="px-6 py-2">
                <Link
                    href={`/withdrawals/${txn.id}`}
                    className="hover:underline font-medium flex items-center gap-1 underline-offset">
                    {shortenId(txn.id)}
                    <PencilIcon size={13} />
                </Link>
            </td>

            {/* Amount */}
            <td className="px-6 py-2 font-medium">
                {formatMoney(+txn.amount, txn.currency)}
            </td>

            {/* Business Info */}
            <td className="px-6 py-2 min-w-[220px]">
                <Link
                    href={`/organizations/${business?.id}/details`}
                    className="flex items-center gap-3 underline-offset">
                    {/* Logo or fallback */}
                    {displayAvatar && (
                        <img
                            src={getAvatar(logo!, business?.business_name)}
                            alt={business?.business_name}
                            className="size-8 rounded-full object-cover"
                        />
                    )}

                    {/* Business Name */}
                    <div className="flex items-center gap-1 dark:text-gray-200">
                        <span className="font-semibold truncate text-gray-800 dark:text-gray-100">
                            {business?.business_name || '-'}
                        </span>
                    </div>
                </Link>
            </td>

            {/* Status */}
            <td className="px-6 py-2">
                <span
                    className={cn(
                        'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                        txn.status === 'SUCCESS'
                            ? 'bg-green-100 text-green-800'
                            : txn.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : txn.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                    )}>
                    {txn.status}
                </span>
            </td>
        </tr>
    );
};

export default WithdrawalItem;
