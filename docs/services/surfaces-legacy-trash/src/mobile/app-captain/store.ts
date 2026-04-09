import { configureStore } from '@reduxjs/toolkit';

const placeholderReducer = (state = { initialized: true }, action: { type: string }) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const appCaptainStore = configureStore({
  reducer: { app: placeholderReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['persist/PERSIST'] } }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppCaptainRootState = ReturnType<typeof appCaptainStore.getState>;
export type AppCaptainAppDispatch = typeof appCaptainStore.dispatch;
