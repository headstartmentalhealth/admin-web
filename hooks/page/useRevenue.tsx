import { fetchRevenue } from '@/redux/slices/analyticsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useRevenue = () => {
  const dispatch = useDispatch<AppDispatch>();

  let { revenue, revenuesLoading } = useSelector(
    (state: RootState) => state.analytics
  );

  const year = new Date().getFullYear();

  useEffect(() => {
    dispatch(fetchRevenue({ year }));
  }, [dispatch]);

  return {
    revenue,
    revenuesLoading,
  };
};

export default useRevenue;
