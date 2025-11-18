import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetails, ProductsResponse } from '@/types/product';
import api from '@/lib/api';
import { Cart, CartResponse } from '@/types/cart';

interface CartState {
  carts: Cart[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: CartState = {
  carts: [],
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated carts
export const fetchCarts = createAsyncThunk(
  '/cart/fetch-all',
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

    const { data } = await api.get<CartResponse>('/cart/fetch-all', {
      params,
    });

    return {
      carts: data.data,
      count: data.count,
    };
  }
);

const cartSlice = createSlice({
  name: 'carts',
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
      .addCase(fetchCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload.carts;
        state.count = action.payload.count;
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch carts';
      });
  },
});

export const { setPage, setPerPage } = cartSlice.actions;
export default cartSlice.reducer;
