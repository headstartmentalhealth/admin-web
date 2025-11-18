import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { PaymentResponse, Transaction } from '@/types/payment';
import { PurchaseItemType } from '@/lib/utils';

interface PaymentState {
  payments: Transaction[];
  distinctPayments: Transaction[];
  count: number;
  countDistinct: number;
  loading: boolean;
  distinctLoading: boolean;
  error: string | null;
  distinctError: string | null;
  currentPage: number;
}

// Initial state
const initialState: PaymentState = {
  payments: [],
  distinctPayments: [],
  count: 0,
  countDistinct: 0,
  loading: false,
  distinctLoading: false,
  error: null,
  distinctError: null,
  currentPage: 1,
};

// Async thunk to fetch paginated payments
export const fetchPayments = createAsyncThunk(
  'payment/fetch-all',
  async ({
    page,
    limit,
    q,
    startDate,
    endDate,
    business_id,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;
    if (business_id !== undefined) params['business_id'] = business_id;

    const { data } = await api.get<PaymentResponse>('/payment/fetch-all', {
      params,
    });

    return {
      payments: data.data,
      count: data.count,
    };
  }
);

// Async thunk to fetch paginated distinct payments
export const fetchDistinctPayments = createAsyncThunk(
  'payment/fetch-distinct',
  async ({
    page,
    limit,
    q,
    startDate,
    endDate,
    business_id,
    purchase_type,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
    purchase_type?: PurchaseItemType;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;
    if (business_id !== undefined) params['business_id'] = business_id;
    if (purchase_type !== undefined) params['purchase_type'] = purchase_type;

    const { data } = await api.get<PaymentResponse>('/payment/fetch-distinct', {
      params,
    });

    return {
      payments: data.data,
      count: data.count,
    };
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      // state.perPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.count = action.payload.count;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payments';
      })
      .addCase(fetchDistinctPayments.pending, (state) => {
        state.distinctLoading = true;
        state.distinctError = null;
      })
      .addCase(fetchDistinctPayments.fulfilled, (state, action) => {
        state.distinctLoading = false;
        state.distinctPayments = action.payload.payments;
        state.countDistinct = action.payload.count;
      })
      .addCase(fetchDistinctPayments.rejected, (state, action) => {
        state.distinctLoading = false;
        state.distinctError =
          action.error.message || 'Failed to fetch distinct payments';
      });
  },
});

export const { setPage, setPerPage } = paymentSlice.actions;
export default paymentSlice.reducer;
