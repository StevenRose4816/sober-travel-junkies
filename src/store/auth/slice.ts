import {createSlice} from '@reduxjs/toolkit';

interface AuthState {
  user?: any;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: undefined,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});

export const authReducer = authSlice.reducer;
