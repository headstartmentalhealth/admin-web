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
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import { persistReducer } from 'redux-persist';

// Persist configuration for auth slice only
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['auth', 'organization'], // Only persist the auth slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  user: userReducer,
  product: productReducer, // Not persisted
  payment: paymentReducer, // Not persisted
  withdrawal: withdrawalReducer,
  log: logReducer, // Not persisted
  organization: persistReducer(persistConfig, organizationReducer), // Not persisted
  coupon: couponReducer, // Not persisted
  cart: cartReducer, // Not persisted
  subscriptionPlan: subscriptionPlanReducer, // Not persisted
  multimedia: multimediaReducer, // Not persisted
  notification: notificationReducer, // Not persisted
  analytics: analyticsReducer, // Not persisted
  resource: resourceReducer, // Not persisted
  blogPost: blogPostReducer, // Not persisted
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
