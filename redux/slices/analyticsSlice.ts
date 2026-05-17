import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  RevenueReport,
  Metrics,
  MetricsResponse,
  RevenueResponse,
  ProductCountResponse,
  ProductCount,
  ResourceCountResponse,
  ResourceCount,
} from '@/types/analytics';

interface ConnectionMetrics {
  activeHttp: number;
  activeWs: number;
  totalHttp: number;
  totalWs: number;
  totalActive: number;
}

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
  resourceCountLoading: boolean;
  resourceCountError: string | null;
  resourceCount: ResourceCount | null;
  connections: ConnectionMetrics | null;
  connectionsLoading: boolean;
  connectionsError: string | null;
}

// Initial state
const initialState: AnalyticsState = {
  metrics: null,
  revenue: null,
  productCount: null,
  resourceCount: null,
  connections: null,
  metricsLoading: false,
  revenuesLoading: false,
  productCountLoading: false,
  resourceCountLoading: false,
  connectionsLoading: false,
  metricsError: null,
  revenueError: null,
  productCountError: null,
  resourceCountError: null,
  connectionsError: null,
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


// Async thunk to fetch resource count
export const fetchResourceCount = createAsyncThunk(
  'owner-analytics/fetch-resource-count',
  async () => {
    const params: Record<string, any> = {};

    const { data } = await api.get<ResourceCountResponse>(
      '/owner-analytics/fetch-resource-count',
      {
        params,
      }
    );

    return {
      resource_count: data.data,
    };
  }
);

// Async thunk to fetch connection metrics
export const fetchConnections = createAsyncThunk(
  'owner-analytics/fetch-connections',
  async () => {
    const { data } = await api.get<any>(
      '/owner-analytics/fetch-connections'
    );
    return {
      connections: data.data,
    };
  }
);

const analysisSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
  },
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
      })
      .addCase(fetchResourceCount.pending, (state) => {
        state.resourceCountLoading = true;
        state.resourceCountError = null;
      })
      .addCase(fetchResourceCount.fulfilled, (state, action) => {
        state.resourceCountLoading = false;
        state.resourceCount = action.payload.resource_count;
      })
      .addCase(fetchResourceCount.rejected, (state, action) => {
        state.resourceCountLoading = false;
        state.resourceCountError =
          action.error.message || 'Failed to fetch resource count';
      })
      .addCase(fetchConnections.pending, (state) => {
        state.connectionsLoading = true;
        state.connectionsError = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connectionsLoading = false;
        state.connections = action.payload.connections;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.connectionsLoading = false;
        state.connectionsError =
          action.error.message || 'Failed to fetch connection metrics';
      });
  },
});

export const { setConnections } = analysisSlice.actions;
export default analysisSlice.reducer;
