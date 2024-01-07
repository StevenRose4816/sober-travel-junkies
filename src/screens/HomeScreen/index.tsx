import {FC} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

import styles from './styles';

const HomeScreen: FC = () => {
  const logout = () => {
    auth().signOut();
  };
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'red', justifyContent: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 25,
            color: 'white',
          }}>
          {'Home Screen'}
        </Text>
      </View>
      <View style={{flex: 1, backgroundColor: 'darkorange'}} />
      <View style={{flex: 1, backgroundColor: 'green'}} />
      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: 'blue',
          minHeight: 50,
          justifyContent: 'center',
          borderRadius: 5,
          marginHorizontal: 10,
          marginTop: 20,
          marginBottom: 20,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 21,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          {'Log Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
