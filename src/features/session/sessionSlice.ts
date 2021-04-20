import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '../../models/models';
import { Auth } from '@aws-amplify/auth';

export type SessionUpdatePayload = Session;

export const logout = createAsyncThunk('logout', async () => {
  await Auth.signOut();
});

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    user: null as User | null,
    isCheckedSignInState: false,
  },
  reducers: {
    update: (state, action: PayloadAction<SessionUpdatePayload>) => {
      if (action.payload.user !== null) {
        state.user = action.payload.user;
      }
      state.isCheckedSignInState = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
  },
});
