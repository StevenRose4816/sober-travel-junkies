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
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../../store/user/slice';

const HomeScreen: FC = () => {
  const {navigate} = useNavigation();
  // const {route} = useRoute();
  // const {userImage} = route.params;
  // console.log('userImage=', userImage);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setUserPhoto({userPhoto: null}));
    auth().signOut();
  };

  const openPicker = () => {
    navigate('Image Picker');
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
      userPhoto: userPhoto,
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
      setAddress(data.address);
      setFullName(data.username);
      setPhoneNumber(data.phoneNumber);
      setUserPhotoFromDB(data.userPhoto);
      console.log('Here is the returned data: ', data);
      console.log('caught data=', caughtData);
    });
  }

  useEffect(() => {
    readData();
  }, [user]);

  const email = useAppSelector(state => state.auth.user?.email);
  const userPhoto = useAppSelector(state => state.user.userPhoto);
  console.log('userPhoto=', userPhoto);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [userPhotoFromDB, setUserPhotoFromDB] = useState('');

  const onSubmit = () => {
    create(userId);
    console.log('pressed');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
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
        {caughtData && (
          <>
            <Image
              style={{height: 200, width: 200, marginLeft: 10}}
              source={{uri: userPhotoFromDB}}></Image>
            <Text style={{marginLeft: 10}}>{'Address: ' + address}</Text>
            <Text style={{marginLeft: 10}}>
              {'Phone number: ' + phoneNumber}
            </Text>
            <Text style={{marginLeft: 10}}>{'Full name: ' + fullName}</Text>
          </>
        )}
        {!caughtData && (
          <>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                marginBottom: 20,
                fontWeight: '600',
              }}>
              {"\nLet's start by getting some informaton."}
            </Text>
            {!userPhoto ? (
              <TouchableOpacity
                onPress={openPicker}
                style={{
                  backgroundColor: 'white',
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  marginTop: 10,
                  marginBottom: 0,
                }}>
                <Image
                  style={{height: 200, width: 200}}
                  source={require('../../Images/profile-picture-vector.jpeg')}></Image>
              </TouchableOpacity>
            ) : (
              <Image
                style={{height: 200, width: 200, marginLeft: 10}}
                source={{uri: userPhoto}}></Image>
            )}
            <Text style={{marginLeft: 10}}>{'\n\nfull name'}</Text>
            <TextInput
              value={fullName}
              placeholder=" full name"
              onChangeText={fullName => setFullName(fullName)}
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
        {!caughtData && (
          <TouchableOpacity
            onPress={onSubmit}
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
      </ScrollView>
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
