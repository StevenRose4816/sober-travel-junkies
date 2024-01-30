import {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {onValue, ref, set} from 'firebase/database';
import styles from './styles';
import {useAppSelector} from '../../hooks';
import {db} from '../HomeScreen/FirebaseConfigurations';

const HomeScreen: FC = () => {
  const logout = () => {
    auth().signOut();
  };

  const user = auth().currentUser;
  const userId = auth().currentUser?.uid;
  const [caughtData, setCaughtData] = useState(undefined);

  function create(userId: string | undefined) {
    set(ref(db, 'users/' + userId), {
      username: fullName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
    })
      .then(() => {
        console.log('db updated yo');
      })
      .catch(error => {
        console.log(error);
      });
  }

  function update(userId: string | undefined) {
    set(ref(db, 'users/' + userId), {
      username: fullName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
    })
      .then(() => {
        console.log('data updated db');
      })
      .catch(error => {
        console.log(error);
      });
  }

  function readData() {
    const countRef = ref(db, 'users/' + userId);
    onValue(countRef, snapshot => {
      const data = snapshot.val();
      setCaughtData(data);
      console.log('Here is the returned data: ', data);
      console.log('caught data=', caughtData);
    });
  }

  useEffect(() => {
    console.log('Hello: ', user);
    readData();
  }, [user]);

  const email = useAppSelector(state => state.auth.user?.email);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const onPress = () => {
    create(userId);
    console.log('pressed');
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Text
          style={{
            textAlign: 'left',
            fontSize: 30,
            color: 'black',
            fontWeight: '600',
            marginTop: 10,
            marginHorizontal: 10,
          }}>
          {'Hello ' + email + '!\n'}
        </Text>
        {!caughtData && (
          <>
            <Image
              style={{height: 200, width: 200, marginLeft: 10}}
              source={require('../../Images/profile-picture-vector.jpeg')}></Image>
            <Text style={{fontSize: 16, marginLeft: 10, fontWeight: '600'}}>
              {"\nLet's start by getting some informaton."}
            </Text>
            <Text style={{marginLeft: 10}}>{'\n\nfull name'}</Text>
            <TextInput
              value={fullName}
              placeholder=" full name"
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
              placeholder=" phone number"
              onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
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
              placeholder=" address"
              onChangeText={address => setAddress(address)}
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
          </>
        )}
      </View>
      {!caughtData && (
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: 'blue',
            minHeight: 50,
            justifyContent: 'center',
            borderRadius: 5,
            marginHorizontal: 10,
            marginTop: 10,
            marginBottom: 0,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 21,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {'Submit'}
          </Text>
        </TouchableOpacity>
      )}
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
    </ScrollView>
  );
};

export default HomeScreen;
