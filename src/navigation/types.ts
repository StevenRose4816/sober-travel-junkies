import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Routes from '../navigation/routes';
import Contacts from 'react-native-contacts';

export type NavPropAny = NativeStackNavigationProp<any, any>;

export type AppStackParams = {
  [Routes.homeScreen]: undefined;
  [Routes.loginScreen]: undefined;
  [Routes.imagePicker]: undefined;
  [Routes.booneScreen]: undefined;
  [Routes.messageBoardScreen]: {
    fullName: string;
    userPhotoFromDB: string;
    backgroundPhoto: any;
  };
  [Routes.signupScreen]: undefined;
  [Routes.tripInfoScreen]: undefined;
  [Routes.contactScreen]: Contacts.Contact[];
};
