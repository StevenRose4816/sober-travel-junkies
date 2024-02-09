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
import {useAppSelector} from '../../hooks';
import {db} from '../HomeScreen/FirebaseConfigurations';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../../store/user/slice';

const HomeScreen: FC = () => {
  const {navigate} = useNavigation();
  const navigation = useNavigation();
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
  const [modalVisible, setModalVisible] = useState(false);
  const [dataFlag, setDataFlag] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

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
        console.log('db created/updated');
      })
      .catch(error => {
        console.log(error);
      });
  }

  function readData() {
    const countRef = ref(db, 'users/' + userId);
    onValue(countRef, snapshot => {
      const data = snapshot.val();
      if (!!data) {
        setDataFlag(true);
        console.log('data: ', data);
      }
      setAddress(data.address);
      setFullName(data.username);
      setPhoneNumber(data.phoneNumber);
      setUserPhotoFromDB(data.userPhoto);
    });
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        showBackButton && (
          <TouchableOpacity
            onPress={onPressGoBack}
            style={{
              backgroundColor: 'blue',
              borderRadius: 5,
              width: 65,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                marginTop: 5,
                marginBottom: 5,
                fontSize: 12,
              }}>
              {'Go back'}
            </Text>
          </TouchableOpacity>
        ),
      headerRight: () => (
        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: 'blue',
            borderRadius: 5,
            width: 65,
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              marginTop: 5,
              marginBottom: 5,
              fontSize: 12,
            }}>
            {'Log out'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, showBackButton]);

  useEffect(() => {
    readData();
  }, [user]);

  useEffect(() => {
    if (dataFlag) {
      console.log('dataFlag: ', dataFlag);
    } else if (!dataFlag) {
      console.log('No data here.');
    } else {
      console.log('How did we get here?');
    }
  }, [dataFlag]);

  const email = useAppSelector(state => state.auth.user?.email);
  const userPhoto = useAppSelector(state => state.user.userPhoto);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [userPhotoFromDB, setUserPhotoFromDB] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const onEditPress = () => {
    setModalVisible(true);
  };

  const toggleDataFlag = () => {
    if (dataFlag) {
      setDataFlag(false);
    } else if (!dataFlag) {
      setDataFlag(true);
    }
  };

  const onPressSubmit = () => {
    setModalVisible(true);
    setSuccessMessage(true);
  };

  const onPressGoBack = () => {
    setShowBackButton(false);
    toggleDataFlag();
  };

  const onPressYes = () => {
    readData();
    setDataFlag(false);
    setModalVisible(false);
    setShowBackButton(true);
  };

  const onPressYesSubmit = () => {
    setShowBackButton(false);
    if (!dataFlag) {
      setDataFlag(true);
    }
    create(userId);
    readData();
    setSuccessMessage(false);
    setModalVisible(false);
    console.log('Submit pressed.');
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
        {dataFlag && (
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
            <Text style={{marginLeft: 10, marginBottom: 210}}>
              {'Full name: ' + fullName}
            </Text>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                backgroundColor: 'white',
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
              {showSubmit && (
                <TouchableOpacity
                  onPress={onPressSubmit}
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
              )}
            </View>
          </>
        )}
        {!dataFlag && (
          <>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                marginBottom: 20,
                fontWeight: '600',
                marginTop: 10,
              }}>
              {"Let's get some informaton."}
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
            <Text style={{marginLeft: 10, marginTop: 30, fontWeight: '600'}}>
              {'Full Name'}
            </Text>
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
                width: 300,
              }}></TextInput>
            <Text style={{marginLeft: 10, fontWeight: '600', marginTop: 10}}>
              {'Phone Number'}
            </Text>
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
                width: 300,
              }}></TextInput>
            <Text style={{marginLeft: 10, marginTop: 10, fontWeight: '600'}}>
              {'Address'}
            </Text>
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
                width: 300,
              }}></TextInput>
          </>
        )}
        {!dataFlag && (
          <TouchableOpacity
            onPress={onPressSubmit}
            style={{
              backgroundColor: 'blue',
              minHeight: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginHorizontal: 10,
              marginTop: 10,
              marginBottom: 10,
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
            {successMessage ? (
              <Text
                style={{textAlign: 'center', color: 'white', marginBottom: 20}}>
                {'Does this look correct? Name: ' +
                  fullName +
                  ' Phone Number: ' +
                  phoneNumber +
                  ' Address: ' +
                  address}
              </Text>
            ) : (
              <Text
                style={{textAlign: 'center', color: 'white', marginBottom: 20}}>
                {'Do you want to edit your information?'}
              </Text>
            )}
            <TouchableOpacity
              onPress={successMessage ? onPressYesSubmit : onPressYes}
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
