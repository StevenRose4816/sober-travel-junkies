import {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {IUser, setUser} from '../store/auth/slice';
import {useAppDispatch, useAppSelector} from '../hooks';
import ImagePicker from '../components/ImagePicker.tsx';
import MessageBoardScreen from '../screens/MessageBoardScreen/index.tsx';
import {AppStackParams} from './types.ts';
import Routes from '../navigation/routes.ts';
import {VisionBoardScreen} from '../screens/VisionBoardScreen/index.tsx';
import Home_Screen from '../screens/Home_Screen/index.tsx';
import EditUserInfoScreen from '../screens/EditUserInfoScreen/index.tsx';
import CalenderScreen from '../screens/CalenderScreen/index.tsx';
import LoginScreen from '../screens/LoginScreen/index.tsx';

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
            name={Routes.home_Screen}
            component={Home_Screen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          />
          <RootStack.Screen
            name={Routes.editUserInfoScreen}
            component={EditUserInfoScreen}
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
            name={Routes.calenderScreen}
            component={CalenderScreen}
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
            name={Routes.visionBoardScreen}
            component={VisionBoardScreen}
            options={{
              headerTitleStyle: {
                fontSize: 20,
              },
              headerBackVisible: false,
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
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
