import {
  fetchContacts,
  fetchOrganizationDetails,
} from '@/redux/slices/organizationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';

const useContacts = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  let { contacts, loading, totalContacts } = useSelector(
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
  } = useQueryParams(contacts);

  useEffect(() => {
    dispatch(
      fetchContacts({
        businessId: params.id as string,
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })
    );
  }, [dispatch, currentPage, perPage, q, startDate, endDate]);

  return {
    contacts,
    loading,
    count: totalContacts,
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

export default useContacts;
