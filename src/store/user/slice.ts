import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface UserState {
  userPhoto: string | undefined;
}

const initialState: UserState = {
  userPhoto: undefined,
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
