import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface PhotoState {
  selected: boolean;
}

const initialState: PhotoState = {
  selected: false,
};

type SetSelected = PayloadAction<{selected: any}>;

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    setSelected: (state, {payload}: SetSelected) => {
      state.selected = payload.selected;
    },
  },
});

export const {setSelected} = photoSlice.actions;
export const photoReducer = photoSlice.reducer;
