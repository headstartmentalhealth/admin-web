import { fetchProductCount } from '@/redux/slices/analyticsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useProductCount = () => {
  const dispatch = useDispatch<AppDispatch>();

  let { productCount, productCountLoading } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchProductCount());
  }, [dispatch]);

  return {
    productCount,
    productCountLoading,
  };
};

export default useProductCount;
