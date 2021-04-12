import { createWrapper } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';
import counter from './features/counter/counterSlice';
import { Constant } from './constant';
import { sessionSlice } from './features/session/sessionSlice';

const store = configureStore({
  reducer: { counter, session: sessionSlice.reducer },
});

export const wrapper = createWrapper(() => store, {
  debug: Constant.enableReduxWrapperDebugMode,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
