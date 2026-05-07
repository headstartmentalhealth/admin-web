import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import paymentReducer from './slices/paymentSlice';
import withdrawalReducer from './slices/withdrawalSlice';
import logReducer from './slices/logSlice';
import organizationReducer from './slices/organizationSlice';
import couponReducer from './slices/couponSlice';
import cartReducer from './slices/cartSlice';
import subscriptionPlanReducer from './slices/subscriptionPlanSlice';
import multimediaReducer from './slices/multimediaSlice';
import notificationReducer from './slices/notificationSlice';
import analyticsReducer from './slices/analyticsSlice';
import userReducer from './slices/userSlice';
import resourceReducer from './slices/resourceSlice';
import blogPostReducer from './slices/blogPostSlice';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// SSR-safe storage: falls back to noop on the server where localStorage is unavailable
function createNoopStorage() {
  return {
    getItem: (_key: string) => Promise.resolve(null),
    setItem: (_key: string, value: unknown) => Promise.resolve(value),
    removeItem: (_key: string) => Promise.resolve(),
  };
}

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

// Persist configuration for auth slice only
const authPersistConfig = {
  key: 'auth',
  storage,
};

const orgPersistConfig = {
  key: 'organization',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  product: productReducer,
  payment: paymentReducer,
  withdrawal: withdrawalReducer,
  log: logReducer,
  organization: persistReducer(orgPersistConfig, organizationReducer),
  coupon: couponReducer,
  cart: cartReducer,
  subscriptionPlan: subscriptionPlanReducer,
  multimedia: multimediaReducer,
  notification: notificationReducer,
  analytics: analyticsReducer,
  resource: resourceReducer,
  blogPost: blogPostReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches actions with function values — ignore them
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/FLUSH', 'persist/REGISTER'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
