import { fetchConnections, setConnections } from '@/redux/slices/analyticsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

const useConnections = (enablePolling = true, intervalMs = 3000) => {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);

  const { connections, connectionsLoading, connectionsError } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    // Initial fetch
    dispatch(fetchConnections());

    if (!enablePolling) return;

    // Real-time WebSockets
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Connect to WebSocket
    socketRef.current = io(backendUrl, {
      transports: ['websocket'],
    });

    socketRef.current.on('metricsUpdated', (data) => {
      dispatch(setConnections(data));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch, enablePolling]);

  return {
    connections,
    connectionsLoading,
    connectionsError,
    refetch: () => dispatch(fetchConnections()),
  };
};

export default useConnections;
