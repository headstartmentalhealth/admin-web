'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { Button } from '@/components/ui/Button';
import { ActionKind } from '@/lib/utils';
import {
  suspendOrgAccount,
  unsuspendOrgAccount,
  updateOrganization,
} from '@/redux/slices/organizationSlice';
import { AppDispatch } from '@/redux/store';
import { BusinessDetails } from '@/types/organization';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBan, FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

interface SuspendUnsuspendOrgAccountProps {
  userId: string;
  isSuspended: boolean;
  organization: BusinessDetails;
}

interface ActionButtonProps {
  isLoading: boolean;
  onClick: () => void;
  variant: 'green' | 'red';
  icon: React.ReactNode;
  label: string;
}

// Custom hook for suspend/unsuspend logic
const useSuspendUnsuspend = (userId: string, organization: BusinessDetails) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openModal, setOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState(
    organization?.user?.is_suspended
      ? ActionKind.FAVORABLE
      : ActionKind.CRITICAL
  );

  const handleSuspend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(
        suspendOrgAccount({
          user_id: userId,
          suspension_reason: reason,
        })
      );

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      setReason('');
      setAction(ActionKind.FAVORABLE);

      dispatch(
        updateOrganization({
          user: { ...organization.user, is_suspended: true },
        })
      );

      toast.success(response?.payload?.message);
    } catch (error: any) {
      console.error('Suspension failed:', error);
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userId, reason, organization]);

  const handleUnsuspend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(
        unsuspendOrgAccount({
          user_id: userId,
        })
      );

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      setAction(ActionKind.CRITICAL);

      dispatch(
        updateOrganization({
          user: { ...organization.user, is_suspended: false },
        })
      );

      toast.success(response?.payload?.message);
    } catch (error: any) {
      console.error('Unsuspension failed:', error);
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userId, organization]);

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

  return {
    openModal,
    setOpenModal,
    allowAction,
    setAllowAction,
    reason,
    setReason,
    isLoading,
    action,
  };
};

// Action Button Component
const ActionButton: React.FC<ActionButtonProps> = ({
  isLoading,
  onClick,
  variant,
  icon,
  label,
}) => (
  <Button
    className='p-2 px-3 space-x-1'
    onClick={onClick}
    variant={variant}
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
      </>
    ) : (
      <>
        {icon} <span>{label}</span>
      </>
    )}
  </Button>
);

const SuspendUnsuspendOrgAccount: React.FC<SuspendUnsuspendOrgAccountProps> = ({
  userId,
  isSuspended,
  organization,
}) => {
  const {
    openModal,
    setOpenModal,
    allowAction,
    setAllowAction,
    reason,
    setReason,
    isLoading,
    action,
  } = useSuspendUnsuspend(userId, organization);

  return (
    <>
      {organization?.user?.is_suspended ? (
        <>
          <ActionButton
            isLoading={isLoading}
            onClick={() => setOpenModal(true)}
            variant='green'
            icon={<FaCheckCircle />}
            label='Reactivate'
          />
          <ActionConfirmationModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            allowAction={allowAction}
            setAllowAction={setAllowAction}
            action={ActionKind.FAVORABLE}
          />
        </>
      ) : (
        <>
          <ActionButton
            isLoading={isLoading}
            onClick={() => setOpenModal(true)}
            variant='red'
            icon={<FaBan />}
            label='Suspend'
          />
          <ActionConfirmationModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            allowAction={allowAction}
            setAllowAction={setAllowAction}
            reason={reason}
            setReason={setReason}
            action={ActionKind.CRITICAL}
          />
        </>
      )}
    </>
  );
};

export default SuspendUnsuspendOrgAccount;
