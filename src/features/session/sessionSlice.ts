import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '../../models/models';
import { Auth } from '@aws-amplify/auth';

export type SessionUpdatePayload = Session;

export const logout = createAsyncThunk('logout', async () => {
  await Auth.signOut();
});

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    session: { user: null } as Session,
    isCheckedSignInState: false,
  },
  reducers: {
    update: (state, action: PayloadAction<SessionUpdatePayload>) => {
      if (action.payload.user !== null) {
        state.session = action.payload;
      }
      state.isCheckedSignInState = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.session = { user: null };
    });
  },
});
