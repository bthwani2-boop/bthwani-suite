import { configureStore } from '@reduxjs/toolkit';

const placeholderReducer = (state = { initialized: true }, action: { type: string }) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const appFieldStore = configureStore({
  reducer: { app: placeholderReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['persist/PERSIST'] } }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppFieldRootState = ReturnType<typeof appFieldStore.getState>;
export type AppFieldAppDispatch = typeof appFieldStore.dispatch;
