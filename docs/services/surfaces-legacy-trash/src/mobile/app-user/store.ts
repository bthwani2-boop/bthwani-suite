import { configureStore } from '@reduxjs/toolkit';

// Placeholder reducers - can be expanded later
const placeholderReducer = (state = { initialized: true }, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Configure the Redux store for app-user mobile
export const appUserStore = configureStore({
  reducer: {
    app: placeholderReducer,
    // Add more reducers here as needed
    // user: userReducer,
    // orders: ordersReducer,
    // notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppUserRootState = ReturnType<typeof appUserStore.getState>;
export type AppUserAppDispatch = typeof appUserStore.dispatch;
