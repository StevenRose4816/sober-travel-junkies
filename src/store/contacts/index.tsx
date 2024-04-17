import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {User} from '../../screens/HomeScreen';
import Contacts from 'react-native-contacts';

export interface IContact {
  contacts: Contacts.Contact[];
}

const initialState: IContact = {
  contacts: [],
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContacts: (
      state,
      {payload}: PayloadAction<{contacts: Contacts.Contact[]}>,
    ) => {
      state.contacts = payload.contacts;
    },
  },
});

export const {setContacts} = contactSlice.actions;

export const contactReducer = contactSlice.reducer;
