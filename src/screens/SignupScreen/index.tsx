import {FC, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';

import styles from './styles';

const SignupScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <View style={{flex: 3}}>
      <View style={{flex: 1, backgroundColor: 'white'}} />
      <View style={{flex: 2, backgroundColor: 'white'}}>
        <Text style={{marginLeft: 10}}>{'email'}</Text>
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            borderRadius: 5,
            minHeight: 50,
            borderWidth: 1,
            borderColor: 'black',
          }}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={{marginLeft: 10, marginTop: 10}}>{'password'}</Text>
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            borderRadius: 5,
            minHeight: 50,
            borderWidth: 1,
            borderColor: 'black',
          }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 60}}>
          <TouchableOpacity
            onPress={login}
            style={{
              backgroundColor: 'blue',
              minHeight: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginHorizontal: 10,
              marginTop: 20,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 21,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;
