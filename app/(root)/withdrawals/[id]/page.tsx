'use client';

import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import {
  cn,
  formatMoney,
  getAvatar,
  shortenId,
  maskSensitiveData,
} from '@/lib/utils';
import React, { useState } from 'react';
import moment from 'moment';
import { IoIosCash } from 'react-icons/io';
import { useWithdrawal } from '@/hooks/page/useWithdrawals';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import WithdrawalModal from '@/components/withdrawal/WithdrawalModal';
import { initiateWithdrawal } from '@/redux/slices/withdrawalSlice';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

// ======= Loading Skeleton Component =======
const ShimmerCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

const ViewWithdrawal = () => {

  const [open, setOpen] = useState(false);
  const { withdrawal, loading } = useWithdrawal();
  const dispatch = useDispatch<AppDispatch>();

  // Statuses that allow processing
  const processableStatuses = ['PENDING'];

  const { postLoading } = useSelector((state: RootState) => state.withdrawal);

  // ================= UTILITIES =================
  const maskedEmail = (email: string | null | undefined) => {
    if (!email) return 'N/A';
    const [username, domain] = email.split('@');
    return `${maskSensitiveData(username)}@${domain}`;
  };

  // ======= Loading =======
  if (loading) return <ShimmerCard />;
  if (!withdrawal) return <p className="text-center py-10">No withdrawal data found.</p>;

  // ======= Handle Process Withdrawal Click =======
  const handleProcessClick = async () => {
    if (!withdrawal?.id) return;
    try {
      await dispatch(initiateWithdrawal({ withdrawalId: withdrawal.id })).unwrap();
      toast.success('Withdrawal initiated successfully');
      setOpen(true);
    } catch (err: any) {
      toast.error(err || 'Failed to initiate withdrawal');
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="section-container space-y-10">

          {/* ========== PAGE HEADING ============= */}
          <PageHeading
            title="Withdrawal Details"
            enableBreadCrumb
            layer2="Withdrawals"
            layer3="Details"
            enableBackButton
            ctaButtons={
              processableStatuses.includes(withdrawal.status)
                ? (
                  <div className="flex-shrink-0 self-start">
                    <Button
                      onClick={handleProcessClick}
                      variant="default"
                      className="text-md bg-primary gap-1 py-2 rounded-lg flex items-center px-3">

                      {postLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing Withdrawal
                        </>
                      ) : (
                        <>
                          <IoIosCash className="text-lg" />
                          Process Withdrawal
                        </>
                      )}
                    </Button>
                  </div>
                )
                : undefined
            }
          />

          {/* ========== DETAILS CARD ============= */}
          <ThemeDivBorder className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-10">

            {/* Withdrawal Info */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Withdrawal Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
                <div><strong>ID:</strong> {shortenId(withdrawal.id)}</div>

                <div>
                  <strong>Status:</strong>{' '}
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      withdrawal.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : withdrawal.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : withdrawal.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    )}>
                    {withdrawal.status}
                  </span>
                </div>
                <div>
                  <strong>Date Created:</strong> {moment(withdrawal.created_at).format('lll')}
                </div>
                <div>
                  <strong>Last Updated:</strong> {moment(withdrawal.updated_at).format('lll')}
                </div>
                <div>
                  <strong>Amount:</strong> {formatMoney(+withdrawal.amount, withdrawal.currency)}
                </div>
                <div><strong>Currency:</strong> {withdrawal.currency}</div>
                <div><strong>Notes:</strong> {withdrawal.notes || 'N/A'}</div>
                <div><strong>Processed By:</strong> {withdrawal.processed_by || 'N/A'}</div>
                <div>
                  <strong>Processed At:</strong>{' '}
                  {withdrawal.processed_at ? moment(withdrawal.processed_at).format('lll') : 'Not Processed'}
                </div>
              </div>
            </section>

            {/* Requested By User */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Requested By
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getAvatar('', withdrawal.requested_by?.name)}
                  alt={withdrawal.requested_by?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {withdrawal.requested_by?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {maskedEmail(withdrawal.requested_by?.email)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
                <div><strong>User ID:</strong> {withdrawal.requested_by?.id}</div>
                <div><strong>Phone:</strong> {withdrawal.requested_by?.phone || 'N/A'}</div>
              </div>
            </section>

            {/* Business Info */}
            {withdrawal.business && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Business Info
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  {withdrawal.business?.logo_url && (
                    <img
                      src={withdrawal.business.logo_url}
                      alt={withdrawal.business.business_name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {withdrawal.business.business_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {withdrawal.business.industry}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
                  <div><strong>Business ID:</strong> {withdrawal.business.id}</div>
                  <div><strong>Owner User ID:</strong> {withdrawal.business.user_id}</div>
                  <div><strong>Size:</strong> {withdrawal.business.business_size}</div>
                  <div><strong>Country:</strong> {withdrawal.business.country}</div>
                  <div><strong>Location:</strong> {withdrawal.business.location}</div>
                </div>
              </section>
            )}

          </ThemeDivBorder>

        </div>
      </main>

      {/* ======= Withdrawal Modal ======= */}
      <WithdrawalModal open={open} setOpen={setOpen} withdrawalId={withdrawal.id} />

    </>
  );
};

export default ViewWithdrawal;
