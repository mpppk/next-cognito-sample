import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/models';
import { AuthState } from '@aws-amplify/ui-components';
import { Auth } from '@aws-amplify/auth';

export interface SessionUpdatePayload {
  user: User | null;
  authState: AuthState;
}

export const logout = createAsyncThunk('logout', async () => {
  await Auth.signOut();
});

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    user: null as User | null,
    authState: null as AuthState | null,
  },
  reducers: {
    update: (state, action: PayloadAction<SessionUpdatePayload>) => {
      if (action.payload.user !== null) {
        state.user = action.payload.user;
      }
      state.authState = action.payload.authState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
  },
});
