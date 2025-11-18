import { fetchOrganizationDetails, fetchOrganizationKYC } from '@/redux/slices/organizationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useOrgKyc = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  let { kyc, loading } = useSelector(
    (state: RootState) => state.organization
  );

  useEffect(() => {
    dispatch(
      fetchOrganizationKYC(
        searchParams.get('orgId') || (params?.id! as string)
      )
    );
  }, [dispatch]);

  return {
    kyc,
    loading,
  };
};

export default useOrgKyc;
