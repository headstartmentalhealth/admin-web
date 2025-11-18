import { fetchOrganizations } from '@/redux/slices/organizationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';

interface UseOrgsProps {
  deleted?: boolean;
}
const useOrgs = ({ deleted }: UseOrgsProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();

  let { organizations, loading, count } = useSelector(
    (state: RootState) => state.organization
  );

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
  } = useQueryParams(organizations);

  useEffect(() => {
    dispatch(
      fetchOrganizations({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(deleted && { deleted }),
      })
    );
  }, [dispatch, currentPage, perPage, q, startDate, endDate]);

  return {
    organizations,
    loading,
    count,
    currentPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useOrgs;
