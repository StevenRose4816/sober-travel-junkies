import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface UserState {
  userPhoto: string | undefined;
  uri: string | undefined;
  selected: boolean;
  messages: any;
}

const initialState: UserState = {
  userPhoto: undefined,
  uri: undefined,
  selected: false,
  messages: undefined,
};

type SetUserPhoto = PayloadAction<{userPhoto: any}>;
type SetUri = PayloadAction<{uri: any}>;
type SetSelected = PayloadAction<{selected: boolean}>;

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
  },
});

export const {setUserPhoto, setBackgroundPhoto, setSelected, setMessages} =
  userPhotoSlice.actions;
export const userPhotoReducer = userPhotoSlice.reducer;
