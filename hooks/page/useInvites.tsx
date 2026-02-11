import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchInvites } from '@/redux/slices/organizationSlice';
import { BusinessOwnerOrgRole } from '@/lib/utils';

const useInvites = (
  role: BusinessOwnerOrgRole = BusinessOwnerOrgRole.BUSINESS_ADMIN
) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    invites,
    invitesLoading: loading,
    invitesError: error,
    invitesCount: count,
  } = useSelector((state: RootState) => state.organization);
  const { organization: org } = useSelector((state: RootState) => state.organization);

  const {
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useQueryParams(invites);

  useEffect(() => {
    dispatch(
      fetchInvites({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org.id }),
        ...(role && { role }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate, org]);

  return {
    invites,
    count,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useInvites;
