import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUserDetail, reviewKycAction } from '@/redux/slices/userSlice';
import { toast } from 'react-hot-toast';

export const useUser = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetail(id));
    }
  }, [dispatch, id]);

  const handleReviewKyc = async (
    kyc_id: string,
    is_approved: boolean,
    disapproval_reason?: string
  ) => {
    try {
      const result = await dispatch(
        reviewKycAction({ kyc_id, is_approved, disapproval_reason })
      ).unwrap();
      toast.success(result.message || 'KYC status updated successfully');
      // Refresh user details to get updated KYC status
      dispatch(fetchUserDetail(id));
    } catch (err: any) {
      toast.error(err || 'Failed to update KYC status');
    }
  };

  return {
    user: selectedUser,
    loading,
    error,
    handleReviewKyc,
    refreshUser: () => dispatch(fetchUserDetail(id)),
  };
};
