import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUserPhoto {
  uri: string;
}

interface UserState {
  userPhoto: IUserPhoto | null;
}

const initialState: UserState = {
  userPhoto: null,
};

type SetUserPhoto = PayloadAction<{userPhoto: any}>;

const userPhotoSlice = createSlice({
  name: 'userPhoto',
  initialState,
  reducers: {
    setUserPhoto: (state, {payload}: SetUserPhoto) => {
      state.userPhoto = payload.userPhoto;
    },
  },
});

export const {setUserPhoto} = userPhotoSlice.actions;

export const userPhotoReducer = userPhotoSlice.reducer;
