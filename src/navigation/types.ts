import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Routes from '../navigation/routes';
import {RouteProp} from '@react-navigation/native';
import {ImageSourcePropType} from 'react-native';

export type NavPropAny = NativeStackNavigationProp<any, any>;

export type AppStackParams = {
  [Routes.home_Screen]: {source?: ImageSourcePropType};
  [Routes.editUserInfoScreen]: {source?: ImageSourcePropType};
  [Routes.loginScreen]: undefined;
  [Routes.imagePicker]: undefined;
  [Routes.calenderScreen]: undefined;
  [Routes.messageBoardScreen]: {
    fullName: string;
    backgroundPhoto: ImageSourcePropType;
  };
  [Routes.visionBoardScreen]: {
    selectedImage?: any;
  };
};

export type HomeScreenRouteProp = RouteProp<
  {Home_Screen: {source?: ImageSourcePropType}},
  'Home_Screen'
>;
