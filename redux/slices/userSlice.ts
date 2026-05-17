import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  Customer,
  CustomersResponse,
} from '@/types/organization';
import { SystemRole } from '@/lib/utils';

interface UserState {
  users: Customer[];
  selectedUser: Customer | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: UserState = {
  users: [],
  selectedUser: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated business customers
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    {
      business_id,
      page,
      limit,
      q,
      role,
      startDate,
      endDate,
    }: {
      business_id?: string;
      page?: number;
      limit?: number;
      q?: string;
      role?: SystemRole;
      startDate?: string;
      endDate?: string;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (role !== undefined) params['role'] = role;
    if (business_id !== undefined) params['business_id'] = business_id;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    try {
      const { data } = await api.get<CustomersResponse>(
        `/contact/fetch-customers`,
        {
          params,
        }
      );

      return {
        users: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Async thunk to fetch single user detail
export const fetchUserDetail = createAsyncThunk(
  'users/fetchUserDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ data: Customer }>(
        `/contact/fetch-customer/${id}`
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

// Async thunk to review KYC
export const reviewKycAction = createAsyncThunk(
  'users/reviewKyc',
  async (
    {
      kyc_id,
      is_approved,
      disapproval_reason,
    }: { kyc_id: string; is_approved: boolean; disapproval_reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch(`/onboard/review-kyc/${kyc_id}`, {
        is_approved,
        disapproval_reason,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to review KYC'
      );
    }
  }
);

// Async thunk to suspend user
export const suspendUserAction = createAsyncThunk(
  'users/suspendUser',
  async (
    { user_id, suspension_reason }: { user_id: string; suspension_reason: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post(`/onboard/suspend-user/${user_id}`, {
        suspension_reason,
      });
      return { user_id, data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to suspend user'
      );
    }
  }
);

// Async thunk to unsuspend user
export const unsuspendUserAction = createAsyncThunk(
  'users/unsuspendUser',
  async (user_id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/onboard/unsuspend-user/${user_id}`);
      return { user_id, data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to unsuspend user'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearUserState: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.count = 0;
      state.loading = false;
      state.error = null;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.count = action.payload.count;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(suspendUserAction.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.user_id);
        if (index !== -1) {
          state.users[index].is_suspended = true;
        }
        if (state.selectedUser && state.selectedUser.id === action.payload.user_id) {
          state.selectedUser.is_suspended = true;
        }
      })
      .addCase(unsuspendUserAction.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.user_id);
        if (index !== -1) {
          state.users[index].is_suspended = false;
        }
        if (state.selectedUser && state.selectedUser.id === action.payload.user_id) {
          state.selectedUser.is_suspended = false;
        }
      });
  },
});

export const { setPage, clearUserState } = userSlice.actions;
export default userSlice.reducer;
