import {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, LoginScreen, SignupScreen} from '../screens';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {IUser, setUser} from '../store/auth/slice';
import {useAppDispatch, useAppSelector} from '../hooks';

const RootStack = createNativeStackNavigator();

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

  console.log('user', user);

  return (
    <NavigationContainer>
      {!!user ? (
        <RootStack.Navigator>
          <RootStack.Screen name={'Home Screen'} component={HomeScreen} />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator>
          <RootStack.Screen name={'Login Screen'} component={LoginScreen} />
          <RootStack.Screen name={'Signup Screen'} component={SignupScreen} />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
