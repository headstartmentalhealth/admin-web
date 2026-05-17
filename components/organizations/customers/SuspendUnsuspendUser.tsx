'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { ActionKind } from '@/lib/utils';
import { suspendUserAction, unsuspendUserAction } from '@/redux/slices/userSlice';
import { AppDispatch } from '@/redux/store';
import { Customer } from '@/types/organization';
import { Loader2, Ban, CheckCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

interface SuspendUnsuspendUserProps {
  user: Customer;
}

const SuspendUnsuspendUser: React.FC<SuspendUnsuspendUserProps> = ({ user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openModal, setOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const action = user.is_suspended ? ActionKind.FAVORABLE : ActionKind.CRITICAL;

  const handleSuspend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(
        suspendUserAction({
          user_id: user.id,
          suspension_reason: reason,
        })
      ).unwrap();

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      setReason('');
      toast.success(response?.payload?.data?.message || 'User suspended successfully');
    } catch (error: any) {
      console.error('Suspension failed:', error);
      toast.error(error || error?.message || 'Failed to suspend user');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, user.id, reason]);

  const handleUnsuspend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(
        unsuspendUserAction(user.id)
      ).unwrap();

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      toast.success(response?.payload?.data?.message || 'User unsuspended successfully');
    } catch (error: any) {
      console.error('Unsuspension failed:', error);
      toast.error(error || error?.message || 'Failed to unsuspend user');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, user.id]);

  useEffect(() => {
    if (allowAction) {
      if (action === ActionKind.CRITICAL) {
        handleSuspend();
      } else {
        handleUnsuspend();
      }
      setAllowAction(false);
    }
  }, [allowAction, action, handleSuspend, handleUnsuspend]);

  return (
    <>
      <button
        type="button"
        disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation(); // prevent clicking link/row
          setOpenModal(true);
        }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${user.is_suspended
          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30 focus:ring-emerald-500'
          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30 focus:ring-rose-500'
          }`}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : user.is_suspended ? (
          <CheckCircle className="w-3.5 h-3.5" />
        ) : (
          <Ban className="w-3.5 h-3.5" />
        )}
        <span>{user.is_suspended ? 'Unsuspend' : 'Suspend'}</span>
      </button>

      <ActionConfirmationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        allowAction={allowAction}
        setAllowAction={setAllowAction}
        reason={reason}
        setReason={setReason}
        action={action}
        body={
          user.is_suspended
            ? `Are you sure you want to unsuspend ${user.name}'s account?`
            : `Are you sure you want to suspend ${user.name}'s account?`
        }
      />
    </>
  );
};

export default SuspendUnsuspendUser;
