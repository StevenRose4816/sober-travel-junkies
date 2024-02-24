import {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {HomeScreen, LoginScreen, SignupScreen} from '../screens';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {IUser, setUser} from '../store/auth/slice';
import {useAppDispatch, useAppSelector} from '../hooks';
import ImagePicker from '../components/ImagePicker.jsx';
import TripInfoScreen from '../screens/TripInfo/index.tsx';
import ChangeBackgroundScreen from '../screens/ChangeBackgroundScreen/index.tsx';

type RootStackParamList = {
  'Home Screen': undefined;
  'Image Picker': {undefined: any};
  'Login Screen': undefined;
  'Signup Screen': undefined;
  'Trip Info Screen': undefined;
  'Change Background Screen': undefined;
};

export type RootStackProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: NativeStackScreenProps<RootStackParamList, T>['route'];
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// const RootStack = createNativeStackNavigator();

const RootNavigator: FC = () => {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      const mappedUser: IUser = {
        email: user.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        metadata: user.metadata,
        providerId: user.providerId,
        uid: user.uid,
      };
      dispatch(setUser({user: mappedUser}));
    } else {
      dispatch(setUser({user: null}));
    }

    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      {!!user ? (
        <RootStack.Navigator screenOptions={{headerBackTitleVisible: false}}>
          <RootStack.Screen
            name={'Home Screen'}
            component={HomeScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'Image Picker'}
            component={ImagePicker}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'Trip Info Screen'}
            component={TripInfoScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'Change Background Screen'}
            component={ChangeBackgroundScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator screenOptions={{headerBackTitleVisible: false}}>
          <RootStack.Screen
            name={'Login Screen'}
            component={LoginScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'Signup Screen'}
            component={SignupScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
