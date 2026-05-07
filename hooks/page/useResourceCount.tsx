import { fetchResourceCount } from '@/redux/slices/analyticsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useResourceCount = () => {
  const dispatch = useDispatch<AppDispatch>();

  let { resourceCount, resourceCountLoading } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchResourceCount());
  }, [dispatch]);

  return {
    resourceCount,
    resourceCountLoading,
  };
};

export default useResourceCount;
