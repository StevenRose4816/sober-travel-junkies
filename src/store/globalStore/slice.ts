import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUserInfo {
  phoneNumber?: string | number;
  address?: string;
  name?: string;
  newUser?: boolean;
}

const initialState: IUserInfo = {
  phoneNumber: '',
  address: '',
  name: '',
  newUser: false,
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
    setNewUser(state, action: PayloadAction<{newUser: boolean}>) {
      const {newUser} = action.payload;
      state.newUser = newUser;
    },
  },
});

export const {setUserInfo} = userSlice.actions;
export const {setNewUser} = userSlice.actions;
export const globalStoreReducer = userSlice.reducer;
