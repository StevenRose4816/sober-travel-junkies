import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUserInfo {
  phoneNumber: string | number;
  address: string;
  name: string;
}

const initialState: IUserInfo = {
  phoneNumber: '',
  address: '',
  name: '',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<IUserInfo>) {
      const {name, phoneNumber, address} = action.payload;
      state.name = name;
      state.phoneNumber = phoneNumber;
      state.address = address;
    },
  },
});

export const {setUserInfo} = userSlice.actions;
export const globalStoreReducer = userSlice.reducer;
