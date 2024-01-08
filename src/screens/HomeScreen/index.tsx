import {FC, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';

import styles from './styles';
import {useAppSelector} from '../../hooks';

const HomeScreen: FC = () => {
  const logout = () => {
    auth().signOut();
  };
  const email = useAppSelector(state => state.auth.user?.email);
  const [fullName, setFullName] = useState('');
  return (
    <View style={{flex: 1, marginTop: 20}}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 30,
            color: 'black',
            fontWeight: '600',
          }}>
          {'Hello ' + email + '!\n'}
          <Text style={{fontSize: 16}}>
            {"\nLet's start by getting some informaton."}
          </Text>
        </Text>
        <Text style={{marginLeft: 10}}>{'\n\nfull name'}</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          secureTextEntry={false}
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            marginBottom: 10,
            marginTop: 10,
            borderRadius: 5,
            minHeight: 50,
            borderWidth: 1,
            borderColor: 'black',
          }}></TextInput>
      </View>
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
