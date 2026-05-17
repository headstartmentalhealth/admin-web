import { fetchConnections } from '@/redux/slices/analyticsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useConnections = (enablePolling = true, intervalMs = 3000) => {
  const dispatch = useDispatch<AppDispatch>();

  const { connections, connectionsLoading, connectionsError } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    // Initial fetch
    dispatch(fetchConnections());

    if (!enablePolling) return;

    // Real-time polling
    const interval = setInterval(() => {
      dispatch(fetchConnections());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [dispatch, enablePolling, intervalMs]);

  return {
    connections,
    connectionsLoading,
    connectionsError,
    refetch: () => dispatch(fetchConnections()),
  };
};

export default useConnections;
