import {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
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
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];

  useEffect(() => {
    console.log('current route is ', route);
    console.log('routes=', routes);
    console.log('previous route=', prevRoute);
  }, [routes, prevRoute, navigation]);

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
  const [modalVisible, setModalVisible] = useState(false);
  const [flag, setFlag] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  function create(userId: string | undefined) {
    set(ref(db, 'users/' + userId), {
      username: fullName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      userPhoto: userPhoto,
    })
      .then(() => {
        console.log('db created');
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
  //new user inputs username and password and gets directed to this screen with only 'Hello..'
  // useEffect(() => {
  //   if (!caughtData && !flag) {
  //     setFlag(true);
  //   }
  // }, [caughtData, flag]);

  useEffect(() => {
    readData();
  }, [user]);

  useEffect(() => {
    console.log('flag: ', flag, ' and ', 'caughtData: ', caughtData);
  }, [flag, caughtData]);

  useEffect(() => {
    if (!flag && !caughtData) {
      if (
        fullName === '' &&
        phoneNumber === '' &&
        address === '' &&
        userPhotoFromDB === ''
      ) {
        console.log(
          'flag is flase, all user variables are undefined, no caught data from DB, must be a new user!',
        );
        setFlag(true);
      } else {
        console.log(
          'fullName: ',
          typeof fullName,
          'phoneNumber: ',
          typeof phoneNumber,
          'address: ',
          typeof address,
          'userPhotoFromDB: ',
          typeof userPhotoFromDB,
        );
      }
    }
  }, []);

  const email = useAppSelector(state => state.auth.user?.email);
  const userPhoto = useAppSelector(state => state.user.userPhoto);
  console.log('userPhoto=', userPhoto);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [userPhotoFromDB, setUserPhotoFromDB] = useState('');

  const onEditPress = () => {
    setModalVisible(true);
  };

  const onSubmit = () => {
    //create and call modal here that lets user know info has been successfully
    setFlag(false);
    create(userId);
    console.log('pressed');
  };

  const onPressYes = () => {
    setFlag(true);
    setModalVisible(false);
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
          {'Hello ' + (fullName || email) + '!\n'}
        </Text>
        {caughtData && !flag && (
          <>
            {userPhotoFromDB || userPhoto ? (
              <Image
                style={{height: 200, width: 200, marginLeft: 10}}
                source={{uri: userPhotoFromDB || userPhoto}}></Image>
            ) : (
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
            )}
            <Text style={{marginLeft: 10, marginTop: 10}}>
              {'Address: ' + address}
            </Text>
            <Text style={{marginLeft: 10}}>
              {'Phone number: ' + phoneNumber}
            </Text>
            <Text style={{marginLeft: 10}}>{'Full name: ' + fullName}</Text>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={onEditPress}
                style={{
                  backgroundColor: 'blue',
                  borderRadius: 5,
                  marginRight: 10,
                  marginBottom: 10,
                  width: 100,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 10,
                    marginTop: 10,
                    marginRight: 10,
                    marginLeft: 10,
                    textAlign: 'center',
                  }}>
                  {'Edit'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSubmit}
                style={{
                  backgroundColor: 'blue',
                  borderRadius: 5,
                  marginRight: 10,
                  width: 100,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 10,
                    marginTop: 10,
                    marginRight: 10,
                    marginLeft: 10,
                    textAlign: 'center',
                  }}>
                  {'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {flag && (
          <>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                marginBottom: 20,
                fontWeight: '600',
              }}>
              {"\nLet's get some informaton."}
            </Text>
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
              {!userPhoto && !userPhotoFromDB ? (
                <Image
                  style={{height: 200, width: 200}}
                  source={require('../../Images/profile-picture-vector.jpeg')}></Image>
              ) : (
                <Image
                  style={{height: 200, width: 200}}
                  source={{uri: userPhoto || userPhotoFromDB}}></Image>
              )}
            </TouchableOpacity>
            <Text style={{marginLeft: 10, marginTop: 30}}>{'full name'}</Text>
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
        {flag && (
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
      <Modal
        visible={modalVisible}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'darkorange',
              minHeight: 300,
              width: '80%',
              justifyContent: 'center',
              borderRadius: 5,
              padding: 20,
            }}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              {'Do you want to edit your information?' + '\n'}
            </Text>
            <TouchableOpacity
              onPress={onPressYes}
              style={{
                marginTop: 20,
                backgroundColor: 'blue',
                minHeight: 50,
                justifyContent: 'center',
                borderRadius: 5,
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 21,
                  fontWeight: '600',
                  backgroundColor: 'blue',
                  borderRadius: 5,
                }}>
                {'Yes'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleModal}
              style={{
                marginTop: 20,
                backgroundColor: 'blue',
                minHeight: 50,
                justifyContent: 'center',
                borderRadius: 5,
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 21,
                  fontWeight: '600',
                  backgroundColor: 'blue',
                  borderRadius: 5,
                }}>
                {'No'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
