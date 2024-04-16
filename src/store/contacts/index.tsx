import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {User} from '../../screens/HomeScreen';

export interface IContact {
  contacts: User[];
}

const initialState: IContact = {
  contacts: [],
};

type SetContacts = PayloadAction<{contacts: any}>;

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContacts: (state, {payload}: SetContacts) => {
      state.contacts = payload.contacts;
    },
  },
});

export const {setContacts} = contactSlice.actions;

export const contactReducer = contactSlice.reducer;
