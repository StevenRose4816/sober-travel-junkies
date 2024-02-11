import {FC, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {onValue, ref, set} from 'firebase/database';
import {useAppSelector} from '../../hooks';
import {db} from '../HomeScreen/FirebaseConfigurations';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../../store/user/slice';
import {DocPicker} from '../../components/DocumentPicker';

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
      console.log('dataFlag is true.');
    } else if (!dataFlag) {
      console.log('dataFlag is false.');
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
  const [switchState, setSwitchState] = useState(false);

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

  const onPressNo = () => {
    if (!dataFlag) {
    }
    if (switchState) {
      toggleSwitch();
    }
    toggleModal();
    setSuccessMessage(false);
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
    if (switchState) {
      toggleSwitch();
    }
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

  const toggleSwitch = () => {
    setSwitchState(previousState => !previousState);
    toggleModal();
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
                style={{
                  height: 200,
                  width: 200,
                  marginLeft: 10,
                  borderRadius: 5,
                }}
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
                }}>
                <Image
                  style={{height: 200, width: 200, borderRadius: 5}}
                  source={require('../../Images/profile-picture-vector.jpeg')}></Image>
              </TouchableOpacity>
            )}
            <Text style={{marginLeft: 10, marginTop: 30, fontWeight: '700'}}>
              {'Address: '}
              <Text style={{fontWeight: '300'}}>{address}</Text>
            </Text>
            <Text style={{marginLeft: 10, marginTop: 10, fontWeight: '700'}}>
              {'Phone number: '}
              <Text style={{fontWeight: '300'}}>{phoneNumber}</Text>
            </Text>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 10,
                marginBottom: 180,
                fontWeight: '700',
              }}>
              {'Full name: '}
              <Text style={{fontWeight: '300'}}>{fullName}</Text>
            </Text>
            {/* <DocPicker></DocPicker> */}
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
              }}>
              {!userPhoto && !userPhotoFromDB ? (
                <Image
                  style={{height: 200, width: 200, borderRadius: 5}}
                  source={require('../../Images/profile-picture-vector.jpeg')}></Image>
              ) : (
                <Image
                  style={{height: 200, width: 200, borderRadius: 5}}
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
                marginTop: 5,
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
                marginTop: 5,
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
                marginTop: 5,
                borderRadius: 5,
                minHeight: 50,
                borderWidth: 1,
                borderColor: 'black',
                width: 300,
              }}></TextInput>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginLeft: 10, marginTop: 10, fontWeight: '600'}}>
                {'Upload Documentation ?'}
              </Text>
              <Switch
                thumbColor={switchState ? 'blue' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={switchState}
                style={{marginLeft: 80}}></Switch>
            </View>
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
              borderColor: 'black',
              backgroundColor: 'darkorange',
              minHeight: 300,
              width: '80%',
              justifyContent: 'center',
              borderRadius: 5,
              padding: 20,
            }}>
            <View
              style={{
                flex: 1,
                borderRadius: 5,
                backgroundColor: 'grey',
                justifyContent: 'center', //vertical
                alignItems: 'center', //horizontal
              }}>
              {successMessage ? (
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: 16,
                    borderRadius: 5,
                    borderColor: 'black',
                  }}>
                  {'Does this look correct?\n\n Name: ' +
                    fullName +
                    '\n' +
                    ' Phone Number: ' +
                    phoneNumber +
                    '\n' +
                    ' Address: ' +
                    address}
                </Text>
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: 18,
                    borderRadius: 5,
                  }}>
                  {'Do you want to edit your information?'}
                </Text>
              )}
            </View>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={successMessage ? onPressYesSubmit : onPressYes}
                style={{
                  marginTop: 20,
                  backgroundColor: 'blue',
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  width: 120,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 21,
                    fontWeight: '600',
                    backgroundColor: 'blue',
                  }}>
                  {'Yes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPressNo}
                style={{
                  marginTop: 20,
                  backgroundColor: 'blue',
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  width: 120,
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
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
