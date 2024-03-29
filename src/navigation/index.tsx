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
import BooneScreen from '../screens/BooneScreen/index.tsx';
import MessageBoardScreen from '../screens/Message Board Screen/MessageBoardScreen.tsx';

export type RootStackParamList = {
  HomeScreen: undefined;
  ImagePicker: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  TripInfoScreen: undefined;
  BooneScreen: {
    setShowTripModal: boolean;
    toggleBackgroundPhotoModal: () => void;
  };
  MessageBoardScreen: {
    fullName: string;
    userPhotoFromDB: string;
    formattedDate: string;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

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
            name={'HomeScreen'}
            component={HomeScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'ImagePicker'}
            component={ImagePicker}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'TripInfoScreen'}
            component={TripInfoScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'BooneScreen'}
            component={BooneScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'MessageBoardScreen'}
            component={MessageBoardScreen}
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
            name={'LoginScreen'}
            component={LoginScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={'SignupScreen'}
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
