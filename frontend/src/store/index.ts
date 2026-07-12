import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import assetsReducer from './slices/assetSlice';
import bookingsReducer from './slices/bookingSlice';
import organizationReducer from './slices/organizationSlice';
import { usersReducer } from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    assets: assetsReducer,
    bookings: bookingsReducer,
    organization: organizationReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
