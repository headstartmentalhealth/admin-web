import api from '@/lib/api';
import { ScheduleEmailProps } from '@/lib/schema/notification.schema';
import { NotificationType } from '@/lib/utils';
import {
  InstantNotification,
  InstantNotificationResponse,
  ScheduledNotification,
  ScheduledNotificationResponse,
} from '@/types/notification';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface EmailNotificationState {
  loading: boolean;
  error: string | null;
  instantNotifications: InstantNotification[];
  instantNotificationLoading: boolean;
  scheduledNotifications: ScheduledNotification[];
  scheduledNotificationLoading: boolean;
  countInstantNotifications: number;
  countScheduledNotifications: number;
  unreadInstantNotifications: number;
}

const initialState: EmailNotificationState = {
  loading: false,
  error: null,
  instantNotifications: [],
  instantNotificationLoading: false,
  scheduledNotifications: [],
  scheduledNotificationLoading: false,
  countInstantNotifications: 0,
  countScheduledNotifications: 0,
  unreadInstantNotifications: 0,
};

// Async Thunk for a single email notification dispatch
export const composeEmail = createAsyncThunk(
  'notification-dispatch/trigger',
  async (
    credentials: {
      title: string;
      message: string;
      type: NotificationType;
      is_scheduled: boolean;
      recipients: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        '/notification-dispatch/trigger',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Notification dispatch failed'
      );
    }
  }
);

// Async Thunk for fetching all instant notifications
export const fetchInstant = createAsyncThunk(
  'notification-dispatch/fetch-instant',
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
      const { data } = await api.get<InstantNotificationResponse>(
        `/notification-track/fetch-instant`,
        {
          params,
        }
      );

      return {
        notifications: data.data,
        count: data.count,
        unread_count: data.unread_count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch all instant notifications'
      );
    }
  }
);

//  thunk for marking all as read
export const markAllNotificationsRead = createAsyncThunk(
  'notification-track/mark-all-read',
  async (
    _,
    { rejectWithValue, dispatch }
  ) => {

    try {
      await api.patch(`/notification-track/mark-all-read`, {});

      dispatch(
        fetchInstant({
          page: 1,
          limit: 10,
        })
      );

      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark all as read'
      );
    }
  }
);

// thunk for marking a single notification as read
export const markNotificationRead = createAsyncThunk(
  'notification-track/mark-read/:id',
  async (
    {
      id,
    }: {
      id: string;
    },
    { rejectWithValue, dispatch }
  ) => {

    try {
      await api.patch(`/notification-track/mark-read/${id}`, {});

      // optionally refetch notifications for latest state
      dispatch(
        fetchInstant({
          page: 1,
          limit: 10,
        })
      );

      return { id };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);

// Async Thunk for a scheduled email notification dispatch
export const scheduleEmail = createAsyncThunk(
  'notification-dispatch/initiate-schedule',
  async (credentials: ScheduleEmailProps, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/notification-dispatch/initiate-schedule',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Notification schedule dispatch failed'
      );
    }
  }
);

// Async Thunk for fetching all scheduled notifications
export const fetchScheduled = createAsyncThunk(
  'notification-dispatch/fetch-scheduled',
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
      const { data } = await api.get<ScheduledNotificationResponse>(
        `/notification-track/fetch-scheduled`,
        {
          params,
        }
      );

      return {
        notifications: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch all scheduled notifications'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(composeEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(composeEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(composeEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInstant.pending, (state) => {
        state.instantNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchInstant.fulfilled, (state, action) => {
        state.instantNotificationLoading = false;
        state.instantNotifications = action.payload.notifications;
        state.countInstantNotifications = action.payload.count;
        state.unreadInstantNotifications = action.payload.unread_count;
      })
      .addCase(fetchInstant.rejected, (state, action) => {
        state.instantNotificationLoading = false;
        state.error = action.payload as string;
      })

      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.loading = false;
        state.unreadInstantNotifications = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false;

        // update local state without full refetch
        const notificationId = action.payload.id;
        const notif = state.instantNotifications.find(n => n.id === notificationId);
        if (notif) {
          notif.read = true;
        }
        state.unreadInstantNotifications = Math.max(
          state.unreadInstantNotifications - 1,
          0
        );
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(scheduleEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(scheduleEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchScheduled.pending, (state) => {
        state.scheduledNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduled.fulfilled, (state, action) => {
        state.scheduledNotificationLoading = false;
        state.scheduledNotifications = action.payload.notifications;
        state.countScheduledNotifications = action.payload.count;
      })
      .addCase(fetchScheduled.rejected, (state, action) => {
        state.scheduledNotificationLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default notificationSlice.reducer;
