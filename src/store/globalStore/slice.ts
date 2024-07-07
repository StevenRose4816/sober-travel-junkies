import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUserInfo {
  phoneNumber?: string | number;
  address?: string;
  name?: string;
  newUser: boolean;
  visionBoardUrl?: string | undefined;
}

const initialState: IUserInfo = {
  phoneNumber: '',
  address: '',
  name: '',
  newUser: false,
  visionBoardUrl: undefined,
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
    setVisionBoardUrl(
      state,
      action: PayloadAction<{visionBoardUrl: string | undefined}>,
    ) {
      const {visionBoardUrl} = action.payload;
      state.visionBoardUrl = visionBoardUrl;
    },
  },
});

export const {setUserInfo, setNewUser, setVisionBoardUrl} = userSlice.actions;
export const globalStoreReducer = userSlice.reducer;
