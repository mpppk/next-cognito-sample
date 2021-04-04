import { createWrapper } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';
import counter from './features/counter/counterSlice';
import { Constant } from './constant';

const store = configureStore({
  reducer: { counter },
});

export const wrapper = createWrapper(() => store, {
  debug: Constant.enableReduxWrapperDebugMode,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
