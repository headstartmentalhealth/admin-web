import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  Business,
  BusinessDetails,
  BusinessDetailsResponse,
  BusinessOwner,
  BusinessOwnerResponse,
  BusinessResponse,
  ContactAccount,
  ContactResponse,
  Customer,
  CustomersResponse,
  KycResponse,
  KycType,
} from '@/types/organization';
import { SystemRole } from '@/lib/utils';

interface OrganizationState {
  organizations: Business[];
  organization: BusinessDetails | null;
  contacts: ContactAccount[];
  customers: Customer[];
  kyc: KycType[];
  totalCustomers: number;
  totalContacts: number;
  organizationOwners: BusinessOwner[];
  totalOrgOwners: number;
  count: number;
  loading: boolean;
  kycActionLoading: boolean
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: OrganizationState = {
  organizations: [],
  organization: null,
  kyc: [],
  contacts: [],
  customers: [],
  totalCustomers: 0,
  totalContacts: 0,
  organizationOwners: [],
  totalOrgOwners: 0,
  count: 0,
  loading: false,
  kycActionLoading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated organizations/businesses
export const fetchOrganizations = createAsyncThunk(
  'onboard/fetch-all-businesses',
  async (
    {
      page,
      limit,
      q,
      startDate,
      endDate,
      deleted,
    }: {
      page?: number;
      limit?: number;
      q?: string;
      startDate?: string;
      endDate?: string;
      deleted?: boolean;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;
    if (deleted !== undefined) params['deleted'] = deleted;

    try {
      const { data } = await api.get<BusinessResponse>(
        '/onboard/fetch-all-businesses',
        {
          params,
        }
      );

      return {
        organizations: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organizations'
      );
    }
  }
);

// Async thunk to fetch organization/business details
export const fetchOrganizationDetails = createAsyncThunk(
  'onboard/fetch-business-details/:id',
  async (id: string, { rejectWithValue }) => {
    const params: Record<string, any> = {};

    try {
      const { data } = await api.get<BusinessDetailsResponse>(
        `/onboard/fetch-business-details/${id}`,
        {
          params,
        }
      );

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organization details'
      );
    }
  }
);

// Async thunk to fetch organization/business kyc
export const fetchOrganizationKYC = createAsyncThunk(
  'onboard/fetch-business-kyc/:id',
  async (id: string, { rejectWithValue }) => {
    const params: Record<string, any> = {};

    try {
      const { data } = await api.get<KycResponse>(
        `/onboard/kyc/${id}`,
        {
          params,
        }
      );

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organization details'
      );
    }
  }
);

// Async thunk to approve or reject KYC
export const reviewKYC = createAsyncThunk(
  'onboard/review-kyc',
  async (
    {
      kyc_id,
      is_approved,
      disapproval_reason,
    }: {
      kyc_id: string;
      is_approved: boolean;
      disapproval_reason?: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // 1️⃣ Call review endpoint
      const { data } = await api.patch<GenericResponse>(
        `/onboard/review-kyc/${kyc_id}`,
        {
          is_approved,
          disapproval_reason,
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to review KYC'
      );
    }
  }
);


// Async thunk to fetch paginated organizations/businesses
export const fetchContacts = createAsyncThunk(
  'contact/fetch/:id',
  async (
    {
      businessId,
      page,
      limit,
      q,
      startDate,
      endDate,
    }: {
      businessId: string;
      page?: number;
      limit?: number;
      q?: string;
      startDate?: string;
      endDate?: string;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    try {
      const { data } = await api.get<ContactResponse>(
        `/contact/fetch/${businessId}`,
        {
          params,
        }
      );

      return {
        contacts: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch contacts'
      );
    }
  }
);

// Async thunk to fetch paginated business customers
export const fetchCustomers = createAsyncThunk(
  'contact/fetch-customers',
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
        customers: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch business's customers"
      );
    }
  }
);

// Async thunk to suspend organization account
export const suspendOrgAccount = createAsyncThunk(
  `onboard/suspend-business-owner/:id`,
  async (
    {
      user_id,
      suspension_reason,
    }: {
      user_id: string;
      suspension_reason: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponse>(
        `/onboard/suspend-business-owner/${user_id}`,
        {
          suspension_reason,
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to suspend business owner's account"
      );
    }
  }
);

// Async thunk to unsuspend organization account
export const unsuspendOrgAccount = createAsyncThunk(
  `onboard/unsuspend-business-owner/:id`,
  async (
    {
      user_id,
    }: {
      user_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put<GenericResponse>(
        `/onboard/unsuspend-business-owner/${user_id}`
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to unsuspend business owner's account"
      );
    }
  }
);

// Async thunk to fetch paginated organization owners
export const fetchOrgOwners = createAsyncThunk(
  'onboard/fetch-business-owners',
  async (
    {
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
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    try {
      const { data } = await api.get<BusinessOwnerResponse>(
        '/onboard/fetch-business-owners',
        {
          params,
        }
      );

      return {
        organization_owners: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch business owners'
      );
    }
  }
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      // state.perPage = action.payload;
    },
    updateOrganization: (
      state,
      action: PayloadAction<Partial<BusinessDetails>>
    ) => {
      if (state.organization) {
        state.organization = {
          ...state.organization,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload.organizations;
        state.count = action.payload.count;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchOrganizationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.organization = action.payload;
      })
      .addCase(fetchOrganizationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrganizationKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.kyc = action.payload;
      })
      .addCase(fetchOrganizationKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(reviewKYC.pending, (state) => {
        state.kycActionLoading = true;
        state.error = null;
      })
      .addCase(reviewKYC.fulfilled, (state, action) => {
        state.kycActionLoading = false;
      })
      .addCase(reviewKYC.rejected, (state, action) => {
        state.kycActionLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.contacts = action.payload.contacts;
      state.totalContacts = action.payload.count;
    })
    .addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = action.payload.customers;
      state.totalCustomers = action.payload.count;
    })
    .addCase(fetchCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(suspendOrgAccount.pending, (state) => {
      state.loading = true;
    })
    .addCase(suspendOrgAccount.fulfilled, (state, action) => {
      state.loading = false;
    })
    .addCase(suspendOrgAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(unsuspendOrgAccount.pending, (state) => {
      state.loading = true;
    })
    .addCase(unsuspendOrgAccount.fulfilled, (state, action) => {
      state.loading = false;
    })
    .addCase(unsuspendOrgAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(fetchOrgOwners.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchOrgOwners.fulfilled, (state, action) => {
      state.loading = false;
      state.organizationOwners = action.payload.organization_owners;
      state.totalOrgOwners = action.payload.count;
    })
    .addCase(fetchOrgOwners.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || 'Failed to fetch organization owners';
    });
},
});

export const { setPage, setPerPage, updateOrganization } =
  organizationSlice.actions;
export default organizationSlice.reducer;
