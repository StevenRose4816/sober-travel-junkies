import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface UserState {
  userPhoto: string | undefined;
  uri: string | undefined;
  selected: boolean;
}

const initialState: UserState = {
  userPhoto: undefined,
  uri: undefined,
  selected: false,
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
  },
});

export const {setUserPhoto} = userPhotoSlice.actions;
export const {setBackgroundPhoto} = userPhotoSlice.actions;
export const {setSelected} = userPhotoSlice.actions;

export const userPhotoReducer = userPhotoSlice.reducer;
