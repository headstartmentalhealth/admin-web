'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeading from '@/components/PageHeading';
import { useUser } from '@/hooks/page/useUser';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import Image from 'next/image';
import moment from 'moment-timezone';
import { formatMoney, shortenId } from '@/lib/utils';
import Badge from '@/components/ui/SystemBadge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const UserDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading, error, handleReviewKyc } = useUser(id as string);
  const [isDisapproveModalOpen, setIsDisapproveModalOpen] = useState(false);
  const [disapproveReason, setDisapproveReason] = useState('');
  const [selectedKycId, setSelectedKycId] = useState<string | null>(null);

  if (loading) return <div className='p-10'><LoadingSkeleton /></div>;
  if (error) return <div className='p-10 text-red-500'>Error: {error}</div>;
  if (!user) return <div className='p-10'>User not found.</div>;

  const latestKyc = user.kyc_user && user.kyc_user.length > 0 ? user.kyc_user[0] : null;

  const openDisapproveModal = (kycId: string) => {
    setSelectedKycId(kycId);
    setIsDisapproveModalOpen(true);
  };

  const submitDisapproval = async () => {
    if (!disapproveReason) return;
    if (selectedKycId) {
      await handleReviewKyc(selectedKycId, false, disapproveReason);
      setIsDisapproveModalOpen(false);
      setDisapproveReason('');
    }
  };

  return (
    <main className='pb-20'>
      <header className='section-container'>
        <PageHeading
          title='User Details'
          enableBreadCrumb={true}
          layer2='Users'
          layer3={user.name}
        />
        <div className='mt-4'>
          <button
            onClick={() => router.back()}
            className='text-sm text-primary-main dark:text-white hover:underline flex items-center gap-2'
          >
            ← Back to Users
          </button>
        </div>
      </header>

      <section className='section-container mt-[-80] grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* User Basic Info Card */}
        <div className='md:col-span-1 space-y-6'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'>
            <div className='flex flex-col items-center text-center'>
              <div className='relative w-32 h-32 mb-4'>
                {user.profile?.profile_picture ? (
                  <Image
                    src={user.profile.profile_picture}
                    alt={user.name}
                    fill
                    className='rounded-full object-cover border-4 border-primary-50'
                  />
                ) : (
                  <div className='w-full h-full rounded-full bg-primary-main flex items-center justify-center text-white text-4xl font-bold'>
                    {user.name[0]}
                  </div>
                )}
              </div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>{user.name}</h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 capitalize'>{user.role?.name.replace(/-/g, ' ')}</p>

              <div className='mt-4 flex flex-wrap justify-center gap-2'>
                {user.is_email_verified && <Badge color='green' text='Email Verified' />}
                {user.account_verified && <Badge color='blue' text='Account Verified' />}
                {user.is_suspended && <Badge color='red' text='Suspended' />}
              </div>
            </div>

            <div className='mt-8 space-y-4 text-sm'>
              <div className='flex justify-between border-b pb-2 dark:border-gray-700'>
                <span className='text-gray-500'>Email</span>
                <span className='font-medium text-gray-900 dark:text-white'>{user.email}</span>
              </div>
              <div className='flex justify-between border-b pb-2 dark:border-gray-700'>
                <span className='text-gray-500'>Phone</span>
                <span className='font-medium text-gray-900 dark:text-white'>{user.phone || 'N/A'}</span>
              </div>
              <div className='flex justify-between border-b pb-2 dark:border-gray-700'>
                <span className='text-gray-500'>Country</span>
                <span className='font-medium text-gray-900 dark:text-white'>{user.profile?.country || user.profile?.country_code || 'N/A'}</span>
              </div>
              <div className='flex justify-between border-b pb-2 dark:border-gray-700'>
                <span className='text-gray-500'>Joined</span>
                <span className='font-medium text-gray-900 dark:text-white'>{moment(user.created_at).format('MMM D, YYYY')}</span>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'>
            <h3 className='font-bold mb-4 text-gray-900 dark:text-white'>Recent Payments</h3>
            {user.payments && user.payments.length > 0 ? (
              <div className='space-y-3'>
                {user.payments.slice(0, 5).map((payment: any) => (
                  <div key={payment.id} className='text-xs flex justify-between items-center'>
                    <div>
                      <p className='font-medium'>{payment.purchase_type?.replace(/_/g, ' ')}</p>
                      <p className='text-gray-400'>{moment(payment.created_at).format('MMM D, HH:mm')}</p>
                    </div>
                    <span className='font-bold text-gray-900 dark:text-white'>
                      {formatMoney(+payment.amount, payment.currency)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-xs text-gray-400'>No payment history found.</p>
            )}
          </div>
        </div>

        {/* KYC Section */}
        <div className='md:col-span-2 space-y-6'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>KYC Verification</h3>
              {latestKyc && (
                <div className='flex items-center gap-2'>
                  {latestKyc.is_approved ? (
                    <Badge color='green' text='Approved' />
                  ) : latestKyc.disapproval_reason ? (
                    <Badge color='red' text='Rejected' />
                  ) : (
                    <Badge color='yellow' text='Pending Review' />
                  )}
                </div>
              )}
            </div>

            {latestKyc ? (
              <div className='space-y-8'>
                {latestKyc.disapproval_reason && (
                  <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800'>
                    <p className='text-sm text-red-800 dark:text-red-300 font-medium'>Disapproval Reason:</p>
                    <p className='text-sm text-red-600 dark:text-red-400'>{latestKyc.disapproval_reason}</p>
                  </div>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2 text-sm'>
                    <p className='text-gray-500 font-medium'>ID Type:</p>
                    <p className='text-gray-900 dark:text-white font-bold uppercase'>{latestKyc.id_type}</p>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <p className='text-gray-500 font-medium'>Location:</p>
                    <p className='text-gray-900 dark:text-white'>{latestKyc.city}, {latestKyc.state}, {latestKyc.country}</p>
                  </div>
                </div>

                {/* Document Images */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>Document Front</p>
                    <div className='relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
                      {latestKyc.doc_front ? (
                        <Image src={latestKyc.doc_front} alt='Doc Front' fill className='object-contain' />
                      ) : (
                        <div className='flex items-center justify-center h-full text-gray-400'>No Image</div>
                      )}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>Document Back</p>
                    <div className='relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
                      {latestKyc.doc_back ? (
                        <Image src={latestKyc.doc_back} alt='Doc Back' fill className='object-contain' />
                      ) : (
                        <div className='flex items-center justify-center h-full text-gray-400'>No Image</div>
                      )}
                    </div>
                  </div>
                  {/* <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>Utility Bill / Proof of Address</p>
                    <div className='relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
                      {latestKyc.utility_doc ? (
                        <Image src={latestKyc.utility_doc} alt='Utility Bill' fill className='object-contain' />
                      ) : (
                        <div className='flex items-center justify-center h-full text-gray-400'>No Image</div>
                      )}
                    </div>
                  </div> */}
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>Facial Capture / Selfie</p>
                    <div className='relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
                      {latestKyc.facial_capture_url ? (
                        <Image src={latestKyc.facial_capture_url} alt='Selfie' fill className='object-contain' />
                      ) : (
                        <div className='flex items-center justify-center h-full text-gray-400'>No Image</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!latestKyc.is_approved && (
                  <div className='pt-6 border-t dark:border-gray-700 flex gap-4'>
                    <Button
                      className='bg-green-600 hover:bg-green-700 text-white px-8'
                      onClick={() => handleReviewKyc(latestKyc.id, true)}
                    >
                      Approve KYC
                    </Button>
                    <Button
                      variant='outline'
                      className='border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'
                      onClick={() => openDisapproveModal(latestKyc.id)}
                    >
                      Disapprove
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed rounded-xl dark:border-gray-700'>
                <p>No KYC submission found for this user.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Disapprove Modal */}
      <Modal
        isOpen={isDisapproveModalOpen}
        onClose={() => setIsDisapproveModalOpen(false)}
        title='Disapprove KYC'
      >
        <div className='space-y-4'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Please provide a reason for disapproving this KYC submission. This will be sent to the user.
          </p>
          <div className='space-y-1'>
            <label className='text-xs font-bold uppercase text-gray-400'>Reason for rejection</label>
            <Input
              type='text'
              name='disapproval_reason'
              value={disapproveReason}
              onChange={(e: any) => setDisapproveReason(e.target.value)}
              placeholder='e.g. ID document is blurred or expired'
              className='w-full'
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='ghost' onClick={() => setIsDisapproveModalOpen(false)}>Cancel</Button>
            <Button
              className='bg-red-600 hover:bg-red-700 text-white'
              disabled={!disapproveReason}
              onClick={submitDisapproval}
            >
              Confirm Disapproval
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default UserDetailsPage;
