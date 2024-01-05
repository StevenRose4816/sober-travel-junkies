import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUser {
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: any;
  providerId: string;
  uid: string;
}

interface AuthState {
  user: IUser | null;
}

const initialState: AuthState = {
  user: null,
};

type SetUser = PayloadAction<{user: any}>;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, {payload}: SetUser) => {
      state.user = payload.user;
    },
  },
});

export const {setUser} = authSlice.actions;

export const authReducer = authSlice.reducer;
