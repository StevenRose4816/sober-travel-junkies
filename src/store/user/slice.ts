import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface UserState {
  userPhoto: string | undefined;
  uri: string | undefined;
  selected: boolean;
  messages: any;
  fullName: string | undefined;
  phoneNumber: string | undefined;
  mailingAddress: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

const initialState: UserState = {
  userPhoto: undefined,
  uri: undefined,
  selected: false,
  messages: undefined,
  fullName: undefined,
  phoneNumber: undefined,
  mailingAddress: undefined,
  email: undefined,
  password: undefined,
};

type SetUserPhoto = PayloadAction<{userPhoto: any}>;
type SetUri = PayloadAction<{uri: any}>;
type SetSelected = PayloadAction<{selected: boolean}>;
type SetFullname = PayloadAction<{fullname: string | undefined}>;
type SetPhoneNumber = PayloadAction<{phoneNumber: string | undefined}>;
type SetMailingAddress = PayloadAction<{mailingAddress: string | undefined}>;
type SetEmail = PayloadAction<{email: string | undefined}>;
type SetPassword = PayloadAction<{password: string | undefined}>;

const userPhotoSlice = createSlice({
  name: 'userPhoto',
  initialState,
  reducers: {
    setUserPhoto: (state, {payload}: SetUserPhoto) => {
      state.userPhoto = payload.userPhoto;
    },
    setBackgroundPhoto: (state, {payload}: SetUri) => {
      state.uri = payload.uri;
    },
    setSelected: (state, {payload}: SetSelected) => {
      state.selected = payload.selected;
    },
    setMessages: (state, {payload}: PayloadAction<{messages: any}>) => {
      state.messages = payload.messages;
    },
    setFullname: (state, {payload}: SetFullname) => {
      state.fullName = payload.fullname;
    },
    setPhoneNumber: (state, {payload}: SetPhoneNumber) => {
      state.phoneNumber = payload.phoneNumber;
    },
    setMailingAddress: (state, {payload}: SetMailingAddress) => {
      state.mailingAddress = payload.mailingAddress;
    },
    setEmail: (state, {payload}: SetEmail) => {
      state.email = payload.email;
    },
    setPassword: (state, {payload}: SetPassword) => {
      state.password = payload.password;
    },
  },
  extraReducers: builder => {
    builder.addCase('LOGOUT', () => initialState);
  },
});

export const {
  setUserPhoto,
  setBackgroundPhoto,
  setSelected,
  setMessages,
  setFullname,
  setPhoneNumber,
  setMailingAddress,
  setEmail,
  setPassword,
} = userPhotoSlice.actions;

export const userPhotoReducer = userPhotoSlice.reducer;
