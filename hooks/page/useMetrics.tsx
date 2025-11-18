import { fetchMetrics } from '@/redux/slices/analyticsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useMetrics = () => {
  const dispatch = useDispatch<AppDispatch>();

  let { metrics, metricsLoading } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);

  return {
    metrics,
    metricsLoading,
  };
};

export default useMetrics;
