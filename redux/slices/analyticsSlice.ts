import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  RevenueReport,
  Metrics,
  MetricsResponse,
  RevenueResponse,
  ProductCountResponse,
  ProductCount,
} from '@/types/analytics';

interface AnalyticsState {
  metrics: Metrics | null;
  revenue: RevenueReport | null;
  productCount: ProductCount | null;
  metricsLoading: boolean;
  revenuesLoading: boolean;
  productCountLoading: boolean;
  metricsError: string | null;
  revenueError: string | null;
  productCountError: string | null;
}

// Initial state
const initialState: AnalyticsState = {
  metrics: null,
  revenue: null,
  productCount: null,
  metricsLoading: false,
  revenuesLoading: false,
  productCountLoading: false,
  metricsError: null,
  revenueError: null,
  productCountError: null,
};

// Async thunk to fetch metrics
export const fetchMetrics = createAsyncThunk(
  'owner-analytics/fetch-metrics',
  async () => {
    const { data } = await api.get<MetricsResponse>(
      '/owner-analytics/fetch-metrics'
    );

    return {
      metrics: data.data,
    };
  }
);

// Async thunk to fetch revenue report
export const fetchRevenue = createAsyncThunk(
  'owner-analytics/fetch-revenue',
  async ({ year }: { year?: number }) => {
    const params: Record<string, any> = {};

    if (year !== undefined) params['year'] = year;

    const { data } = await api.get<RevenueResponse>(
      '/owner-analytics/fetch-revenue',
      {
        params,
      }
    );

    return {
      revenue: data.data,
    };
  }
);

// Async thunk to fetch product count
export const fetchProductCount = createAsyncThunk(
  'owner-analytics/fetch-product-count',
  async () => {
    const params: Record<string, any> = {};

    const { data } = await api.get<ProductCountResponse>(
      '/owner-analytics/fetch-product-count',
      {
        params,
      }
    );

    return {
      product_count: data.data,
    };
  }
);

const analysisSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.metricsError = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.metricsError = action.error.message || 'Failed to fetch metrics';
      })
      .addCase(fetchRevenue.pending, (state) => {
        state.revenuesLoading = true;
        state.revenueError = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.revenuesLoading = false;
        state.revenue = action.payload.revenue;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.revenuesLoading = false;
        state.revenueError = action.error.message || 'Failed to fetch revenue';
      })
      .addCase(fetchProductCount.pending, (state) => {
        state.productCountLoading = true;
        state.productCountError = null;
      })
      .addCase(fetchProductCount.fulfilled, (state, action) => {
        state.productCountLoading = false;
        state.productCount = action.payload.product_count;
      })
      .addCase(fetchProductCount.rejected, (state, action) => {
        state.productCountLoading = false;
        state.productCountError =
          action.error.message || 'Failed to fetch product count';
      });
  },
});

export default analysisSlice.reducer;
