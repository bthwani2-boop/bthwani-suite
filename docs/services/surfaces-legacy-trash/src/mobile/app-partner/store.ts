import { configureStore } from '@reduxjs/toolkit';

const placeholderReducer = (state = { initialized: true }, action: { type: string }) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const appPartnerStore = configureStore({
  reducer: { app: placeholderReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['persist/PERSIST'] } }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppPartnerRootState = ReturnType<typeof appPartnerStore.getState>;
export type AppPartnerAppDispatch = typeof appPartnerStore.dispatch;
