import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Routes from '../navigation/routes';

export type NavPropAny = NativeStackNavigationProp<any, any>;

export type AppStackParams = {
  [Routes.homeScreen]: undefined;
  [Routes.loginScreen]: undefined;
  [Routes.imagePicker]: {};
  [Routes.booneScreen]: {};
  [Routes.messageBoardScreen]: {
    fullName: string;
    userPhotoFromDB: string;
    backgroundPhoto: any;
  };
  [Routes.signupScreen]: {};
  [Routes.tripInfoScreen]: {};
};
