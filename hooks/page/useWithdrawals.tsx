import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchWithdrawals, fetchWithdrawal } from '@/redux/slices/withdrawalSlice';
import { useParams } from 'next/navigation';

// Hook for multiple withdrawals
export const useWithdrawals = (limit?: number) => {
    const dispatch = useDispatch<AppDispatch>();

    const { withdrawals, loading, error, count } = useSelector(
        (state: RootState) => state.withdrawal
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
    } = useQueryParams(withdrawals);

    useEffect(() => {
        dispatch(
            fetchWithdrawals({
                page: currentPage,
                limit: limit || perPage,
                ...(q && { q }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
            })
        ).unwrap();
    }, [dispatch, currentPage, perPage, q, startDate, endDate, limit]);

    return {
        withdrawals,
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


export const useWithdrawal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();

    const { withdrawal, loading } = useSelector(
        (state: RootState) => state.withdrawal
    );

    useEffect(() => {
        if (params?.id) {
            dispatch(fetchWithdrawal(params.id as string)).unwrap();
        }
    }, [dispatch, params?.id]);

    return {
        withdrawal,
        loading,
    };
};
