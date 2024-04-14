import {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, LoginScreen, SignupScreen} from '../screens';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {IUser, setUser} from '../store/auth/slice';
import {useAppDispatch, useAppSelector} from '../hooks';
import ImagePicker from '../components/ImagePicker.tsx';
import TripInfoScreen from '../screens/TripInfo/index.tsx';
import BooneScreen from '../screens/BooneScreen/index.tsx';
import MessageBoardScreen from '../screens/Message Board Screen/MessageBoardScreen.tsx';
import {AppStackParams} from './types.ts';
import Routes from '../navigation/routes.ts';
import ContactScreen from '../screens/ContactScreen/index.tsx';

const RootStack = createNativeStackNavigator<AppStackParams>();

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
        <RootStack.Navigator
          screenOptions={{
            headerBackTitleVisible: false,
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
          }}>
          <RootStack.Screen
            name={Routes.homeScreen}
            component={HomeScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.imagePicker}
            component={ImagePicker}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.tripInfoScreen}
            component={TripInfoScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.booneScreen}
            component={BooneScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.messageBoardScreen}
            component={MessageBoardScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.contactScreen}
            component={ContactScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator
          screenOptions={{headerBackTitleVisible: false, headerShown: false}}>
          <RootStack.Screen
            name={Routes.loginScreen}
            component={LoginScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.signupScreen}
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
