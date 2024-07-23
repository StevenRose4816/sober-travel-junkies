import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface DocumentState {
  selected: boolean;
  selectedDocument: any;
}

const initialState: DocumentState = {
  selected: false,
  selectedDocument: undefined,
};

type SetDocumentSelected = PayloadAction<{selected: any}>;
type SetSelectedDocument = PayloadAction<{selectedDocument: any}>;

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocumentSelected: (state, {payload}: SetDocumentSelected) => {
      state.selected = payload.selected;
    },
    setSelectedDocument: (state, {payload}: SetSelectedDocument) => {
      state.selectedDocument = payload.selectedDocument;
    },
  },
  extraReducers: builder => {
    builder.addCase('LOGOUT', () => initialState);
  },
});

export const {setDocumentSelected} = documentSlice.actions;
export const {setSelectedDocument} = documentSlice.actions;
export const documentReducer = documentSlice.reducer;
