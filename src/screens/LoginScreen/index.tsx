import {FC} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

import styles from './styles';
import {useNavigation} from '@react-navigation/native';

const LoginScreen: FC = () => {
  const {navigate} = useNavigation();
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
        />
        <TouchableOpacity
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
