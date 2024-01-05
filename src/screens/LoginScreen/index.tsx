import {FC, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

import styles from './styles';

const LoginScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {navigate} = useNavigation();

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
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
          autoCapitalize={'none'}
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
        <TouchableOpacity
          // @ts-ignore
          onPress={() => navigate('SignupScreen')}
          style={{
            marginTop: 10,
            alignItems: 'flex-end',
            marginRight: 20,
          }}>
          <Text>{'Sign Up'}</Text>
        </TouchableOpacity>
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
              {'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
