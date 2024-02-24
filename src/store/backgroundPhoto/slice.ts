import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface BackgroundPhotoState {
  uri: string | null;
}

const initialState: BackgroundPhotoState = {
  uri: null,
};

type SetBackgroundPhoto = PayloadAction<{uri: any}>;

const backgroundPhotoSlice = createSlice({
  name: 'backgroundPhoto',
  initialState,
  reducers: {
    setBackgroundPhoto: (state, {payload}: SetBackgroundPhoto) => {
      state.uri = payload.uri;
    },
  },
});

export const {setBackgroundPhoto} = backgroundPhotoSlice.actions;
export const backgroundPhotoReducer = backgroundPhotoSlice.reducer;
