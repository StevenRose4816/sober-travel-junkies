import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface DocumentState {
  selected: boolean;
}

const initialState: DocumentState = {
  selected: false,
};

type SetDocumentSelected = PayloadAction<{selected: any}>;

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocumentSelected: (state, {payload}: SetDocumentSelected) => {
      state.selected = payload.selected;
    },
  },
});

export const {setDocumentSelected} = documentSlice.actions;
export const documentReducer = documentSlice.reducer;
