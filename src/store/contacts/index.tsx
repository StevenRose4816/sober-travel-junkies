import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {User} from '../../screens/HomeScreen';
import Contacts from 'react-native-contacts';

export interface IContact {
  contacts: Contacts.Contact[];
  haveContactsBeenAdded: boolean;
}

const initialState: IContact = {
  contacts: [],
  haveContactsBeenAdded: false,
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
    setHaveContactsBeenAdded: (
      state,
      {payload}: PayloadAction<{haveContactsBeenAdded: boolean}>,
    ) => {
      state.haveContactsBeenAdded = payload.haveContactsBeenAdded;
    },
  },
});

export const {setContacts} = contactSlice.actions;
export const {setHaveContactsBeenAdded} = contactSlice.actions;

export const contactReducer = contactSlice.reducer;
