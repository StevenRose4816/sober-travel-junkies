import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Routes from '../navigation/routes';
import Contacts from 'react-native-contacts';
import {User} from '../screens/HomeScreen_deprecated';
import {RouteProp} from '@react-navigation/native';
import {ImageSourcePropType} from 'react-native';

export type NavPropAny = NativeStackNavigationProp<any, any>;

export type AppStackParams = {
  [Routes.homeScreen]: undefined;
  [Routes.home_Screen]: {source?: () => any};
  [Routes.editUserInfoScreen]: {source?: () => any};
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
  [Routes.contactScreen]: {
    contacts: Contacts.Contact[];
    users: User[];
    names: string[];
  };
  [Routes.visionBoardScreen]: {
    selectedImage?: any;
  };
};

export type HomeScreenRouteProp = RouteProp<
  {Home_Screen: {source?: ImageSourcePropType}},
  'Home_Screen'
>;
