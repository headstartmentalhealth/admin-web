import { createSlice, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import {
    Withdrawal,
    WithdrawalDetailsResponse,
    WithdrawalsResponse,
} from '@/types/withdrawal';

// ================= STATE =================

interface WithdrawalState {
    withdrawals: Withdrawal[];
    withdrawal: Withdrawal | null;
    count: number;
    loading: boolean;          // Fetching withdrawals
    postLoading: boolean;      // All post actions (initiate, finalize, verify)
    error: string | null;
    actionResponse: any | null;
}

const initialState: WithdrawalState = {
    withdrawals: [],
    withdrawal: null,
    count: 0,
    loading: false,
    postLoading: false,
    error: null,
    actionResponse: null,
};

// ================= THUNKS =================

// Fetch all withdrawals
export const fetchWithdrawals = createAsyncThunk(
    'withdrawal/fetchAll',
    async ({
        page,
        limit,
        q,
        startDate,
        endDate,
    }: {
        page?: number;
        limit?: number;
        q?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        const params: Record<string, any> = {};

        if (page !== undefined) params['pagination[page]'] = page;
        if (limit !== undefined) params['pagination[limit]'] = limit;
        if (q !== undefined) params.q = q;
        if (startDate !== undefined) params.startDate = startDate;
        if (endDate !== undefined) params.endDate = endDate;

        const { data } = await api.get<WithdrawalsResponse>('/withdraw/fetch-all', { params });

        return {
            withdrawals: data.data,
            count: data.count,
        };
    }
);

// Fetch single withdrawal
export const fetchWithdrawal = createAsyncThunk(
    'withdrawal/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await api.get<WithdrawalDetailsResponse>(`/withdraw/${id}`);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch withdrawal details');
        }
    }
);

// Initiate withdrawal
export const initiateWithdrawal = createAsyncThunk(
    'withdrawal/initiate',
    async ({ withdrawalId }: { withdrawalId: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/withdraw/initiate', { withdrawalId });
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to initiate withdrawal');
        }
    }
);

// Finalize transfer
export const finalizeTransfer = createAsyncThunk(
    'withdrawal/finalizeTransfer',
    async ({ withdrawalId, otp }: { withdrawalId: string; otp: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/withdraw/finalize-transfer', { withdrawalId, otp });
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to finalize transfer');
        }
    }
);

// Verify transfer
export const verifyTransfer = createAsyncThunk(
    'withdrawal/verifyTransfer',
    async ({ reference }: { reference: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/withdraw/verify-transfer', { reference });
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to verify transfer');
        }
    }
);

// ================= SLICE =================

const withdrawalSlice = createSlice({
    name: 'withdrawal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ================= FETCH REQUESTS =================
            .addCase(fetchWithdrawals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWithdrawals.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawals = action.payload.withdrawals;
                state.count = action.payload.count;
            })
            .addCase(fetchWithdrawals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error || 'Failed to fetch withdrawals');
            })
            .addCase(fetchWithdrawal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWithdrawal.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawal = action.payload.data;
            })
            .addCase(fetchWithdrawal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error || 'Failed to fetch withdrawal details');
            });

        // ================= POST ACTIONS (initiate, finalize, verify) =================
        const postActions = [initiateWithdrawal, finalizeTransfer, verifyTransfer];

        postActions.forEach((thunk) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.postLoading = true;
                    state.error = null;
                })
                .addCase(thunk.fulfilled, (state, action) => {
                    state.postLoading = false;
                    state.actionResponse = action.payload;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.postLoading = false;
                    state.error = action.payload as string;
                    toast.error(state.error || 'Action failed');
                });
        });
    },
});

export default withdrawalSlice.reducer;
