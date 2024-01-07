import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUserInfo {
  phoneNumber: string | number;
  address: string;
  name: string;
}
interface IGlobalStoreState {
  userInfo: IUserInfo | null;
}

type SetUserInfo = PayloadAction<{userInfo: any}>;

const initialState: IGlobalStoreState = {
  userInfo: null,
};

const globalSlice = createSlice({
  name: 'globalStore',
  initialState,
  reducers: {
    setUserInfo: (state, {payload}: SetUserInfo) => {
      state.userInfo = payload.userInfo;
    },
  },
});

export const {setUserInfo} = globalSlice.actions;
export const globalStoreReducer = globalSlice.reducer;
