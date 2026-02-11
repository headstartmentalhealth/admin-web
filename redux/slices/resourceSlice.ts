import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Resource, ResourceType, ResourceResponse } from '@/types/resource';

interface ResourceState {
  resources: Resource[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

const initialState: ResourceState = {
  resources: [],
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

export const fetchResources = createAsyncThunk(
  'resources/fetch',
  async (
    {
      page,
      limit,
      q,
      resource_type,
    }: {
      page?: number;
      limit?: number;
      q?: string;
      resource_type?: ResourceType;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};
    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (resource_type !== undefined) params['resource_type'] = resource_type;

    try {
      const { data } = await api.get<ResourceResponse>('/resources', { params });
      return {
        resources: Array.isArray(data.data) ? data.data : [],
        count: data.count || 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resources');
    }
  }
);

export const createResource = createAsyncThunk(
  'resources/create',
  async (dto: Partial<Resource>, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ResourceResponse>('/resources', dto);
      return data.data as Resource;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create resource');
    }
  }
);

export const updateResource = createAsyncThunk(
  'resources/update',
  async ({ id, dto }: { id: string; dto: Partial<Resource> }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<ResourceResponse>(`/resources/${id}`, dto);
      return data.data as Resource;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update resource');
    }
  }
);

export const deleteResource = createAsyncThunk(
  'resources/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/resources/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete resource');
    }
  }
);

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearResourceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload.resources;
        state.count = action.payload.count;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.resources.unshift(action.payload);
        state.count += 1;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        const index = state.resources.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.resources[index] = action.payload;
        }
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter((r) => r.id !== action.payload);
        state.count -= 1;
      });
  },
});

export const { setPage, clearResourceError } = resourceSlice.actions;
export default resourceSlice.reducer;
