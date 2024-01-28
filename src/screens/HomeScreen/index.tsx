import {FC, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';

import styles from './styles';
import {useAppSelector} from '../../hooks';

const HomeScreen: FC = () => {
  const logout = () => {
    auth().signOut();
  };

  const user = auth().currentUser;

  useEffect(() => {
    console.log('Hello: ', user);
  }, [user]);

  const email = useAppSelector(state => state.auth.user?.email);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  return (
    <View style={{flex: 1}}>
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
            marginTop: 10,
          }}>
          {'Hello ' + email + '!\n'}
        </Text>
        <Text style={{fontSize: 16, marginLeft: 10, fontWeight: '600'}}>
          {"\nLet's start by getting some informaton."}
        </Text>
        <Text style={{marginLeft: 10}}>{'\n\nfull name'}</Text>
        <TextInput
          value={fullName}
          onChangeText={val => setFullName(val)}
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
        <Text style={{marginLeft: 10}}>{'\nphone number'}</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={val => setPhoneNumber(val)}
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
        <Text style={{marginLeft: 10}}>{'\naddress'}</Text>
        <TextInput
          value={address}
          onChangeText={val => setAddress(val)}
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
