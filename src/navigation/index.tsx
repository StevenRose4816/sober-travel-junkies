import {FC} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, LoginScreen, SignupScreen} from '../screens';

const RootStack = createNativeStackNavigator();

const RootNavigator: FC = () => {
  const isLoggedIn = false;
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <RootStack.Navigator>
          <RootStack.Screen name={'HomeScreen'} component={HomeScreen} />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator>
          <RootStack.Screen name={'LoginScreen'} component={LoginScreen} />
          <RootStack.Screen name={'SignupScreen'} component={SignupScreen} />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
