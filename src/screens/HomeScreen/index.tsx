import {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {onValue, ref, set} from 'firebase/database';
import {useAppSelector} from '../../hooks';
import {db} from '../HomeScreen/FirebaseConfigurations';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../../store/user/slice';
import {DocPicker} from '../../components/DocumentPicker';
import {setSelected} from '../../store/photo/slice';
import {setSelectedDocument} from '../../store/document/slice';
// import {
//   setDocumentSelected,
//   setSelectedDocument,
// } from '../../store/document/slice';

const HomeScreen: FC = () => {
  const {navigate} = useNavigation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const logout = () => {
    dispatch(setUserPhoto({userPhoto: null}));
    dispatch(setSelectedDocument({selectedDocument: undefined}));
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
  const [initialName, setInitialName] = useState('');
  const [initialAddress, setInitialAddress] = useState('');
  const [initialPhoneNumber, setInitialPhoneNumber] = useState('');

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

  async function readData() {
    const countRef = ref(db, 'users/' + userId);
    onValue(
      countRef,
      snapshot => {
        const data = snapshot.val();
        if (!!data) {
          setDataFlag(true);
          console.log('data: ', data);
        }
        setAddress(data.address);
        setFullName(data.username);
        setPhoneNumber(data.phoneNumber);
        setUserPhotoFromDB(data.userPhoto);
        setInitialName(data.username);
        setInitialAddress(data.address);
        setInitialPhoneNumber(data.phoneNumber);
      },
      error => {
        console.error('Error reading data from the database:', error);
      },
    );
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        showBackButton && (
          <TouchableOpacity
            onPress={onPressGoBack}
            style={{
              width: 50,
            }}>
            <Image
              source={require('../../Images/caret_left.png')}
              style={{
                height: 40,
                width: 40,
              }}></Image>
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
              color: '#eee7da',
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
      setShowCheckListIcon(true);
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
  const [docPickerState, setDocPickerState] = useState(false);
  const [showCameraIcon, setShowCameraIcon] = useState(true);
  const [showCheckListIcon, setShowCheckListIcon] = useState(true);
  const [showFolderIcon, setShowFolderIcon] = useState(true);
  const photoSelected = useAppSelector(state => state.photo.selected);
  const selectedDocument = useAppSelector(
    state => state.document.selectedDocument,
  );
  // const documentSelected = useAppSelector(state => state.document.selected);

  const checkName = () => {
    if (
      initialName !== fullName ||
      initialAddress !== address ||
      initialPhoneNumber !== phoneNumber
    ) {
      setShowCheckListIcon(false);
    } else {
      console.log('None of the TextInputs have changed.');
    }
  };

  useEffect(() => {
    if (photoSelected) {
      console.log('PHOTO SELECTED ');
      setShowCameraIcon(false);
    } else if (!photoSelected) {
      console.log('PHOTO NOT SELECTED');
      setShowCameraIcon(true);
    }
  }, [photoSelected]);

  const onEditPress = () => {
    setModalVisible(true);
    !showCameraIcon && setShowCameraIcon(true);
    !showCheckListIcon && setShowCheckListIcon(true);
    !showFolderIcon && setShowFolderIcon(true);
  };

  const toggleDataFlag = () => {
    dataFlag && setDataFlag(false);
    !dataFlag && setDataFlag(true);
  };

  // const onPressCancel = () => {
  //   toggleModal();
  // };

  const onPressNo = () => {
    docPickerState && toggleDocPickerSwitch();
    !showCheckListIcon && setShowCheckListIcon(true);
    !showFolderIcon && setShowFolderIcon(true);
    !showCameraIcon && setShowCameraIcon(true);
    fullName !== initialName && setFullName(initialName);
    address !== initialAddress && setAddress(initialAddress);
    phoneNumber !== initialPhoneNumber && setPhoneNumber(initialPhoneNumber);
    toggleModal();
    setSuccessMessage(false);
    dispatch(setUserPhoto({userPhoto: null}));
  };

  const onPressSubmit = () => {
    if (selectedDocument) {
      console.log('Document has been selected: ', selectedDocument);
      setShowFolderIcon(false);
    }
    if (!!userPhoto) {
      console.log('There is a userPhoto selected.');
      setShowCameraIcon(false);
    }
    !showCheckListIcon && setShowCheckListIcon(true);
    !showFolderIcon && setShowFolderIcon(true);
    !showCameraIcon && setShowCameraIcon(true);
    checkName();
    setModalVisible(true);
    setSuccessMessage(true);
  };

  const onPressGoBack = () => {
    setShowBackButton(false);
    toggleDataFlag();
  };

  const onPressYes = () => {
    docPickerState && toggleDocPickerSwitch();
    readData();
    setDataFlag(false);
    setModalVisible(false);
    setShowBackButton(true);
  };

  const onPressYesSubmit = () => {
    setShowBackButton(false);
    !dataFlag && setDataFlag(true);
    showCheckListIcon && setShowCheckListIcon(false);
    checkName();
    create(userId);
    readData();
    setSuccessMessage(false);
    setModalVisible(false);
    dispatch(setSelected({selected: false}));
    console.log('Submit pressed.');
  };

  const toggleDocPickerSwitch = () => {
    setDocPickerState(previousState => !previousState);
    toggleModal();
  };

  // useEffect(() => {
  //   console.log('userPhoto: ', userPhoto);
  //   console.log('userPhotoFromDB: ', userPhotoFromDB);
  // }, [userPhoto, userPhotoFromDB]);

  return (
    <View style={{flex: 1, backgroundColor: '#eee7da'}}>
      <ScrollView style={{flex: 1, backgroundColor: '#eee7da'}}>
        <Text
          style={{
            textAlign: 'left',
            fontSize: 30,
            color: '#0c0b09',
            fontWeight: '600',
            marginTop: 10,
            marginLeft: screenWidth * 0.05,
          }}>
          {'Hello ' + (fullName || email) + '!\n'}
        </Text>
        {dataFlag && (
          <>
            {userPhotoFromDB ? (
              <Image
                style={{
                  height: 300,
                  width: 300,
                  marginLeft: 10,
                  borderRadius: 5,
                }}
                source={{uri: userPhotoFromDB}}></Image>
            ) : (
              <Image
                style={{
                  height: 300,
                  width: 300,
                  borderRadius: 5,
                  marginLeft: 10,
                }}
                source={require('../../Images/profile-picture-vector.jpeg')}></Image>
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
                marginBottom: screenHeight * 0.2,
                fontWeight: '700',
              }}>
              {'Full name: '}
              <Text style={{fontWeight: '300'}}>{fullName}</Text>
            </Text>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                backgroundColor: '#eee7da',
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
                    color: '#eee7da',
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
            </View>
          </>
        )}
        {!dataFlag && (
          <>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 25,
                textAlign: 'left',
                marginBottom: 20,
                fontWeight: '600',
              }}>
              {"Let's get some informaton."}
            </Text>
            <View style={{flex: 1, alignItems: 'center'}}>
              {!userPhotoFromDB ? (
                <Image
                  style={{
                    height: 300,
                    width: screenWidth * 0.9,
                    borderRadius: 5,
                  }}
                  source={
                    {uri: userPhoto} ||
                    require('../../Images/profile-picture-vector.jpeg')
                  }
                />
              ) : (
                <Image
                  style={{
                    height: 300,
                    width: screenWidth * 0.9,
                    borderRadius: 5,
                  }}
                  source={{uri: userPhoto || userPhotoFromDB}}
                />
              )}
            </View>
            <View style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    fontWeight: '600',
                    fontSize: 18,
                  }}>
                  {'Upload Photo ?'}
                </Text>
                <TouchableOpacity onPress={openPicker}>
                  <Image
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 5,
                      marginRight: 20,
                    }}
                    source={require('../../Images/camera-icon.jpeg')}></Image>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    fontWeight: '600',
                    fontSize: 18,
                  }}>
                  {'Upload Documentation ?'}
                </Text>
                <TouchableOpacity onPress={toggleDocPickerSwitch}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 5,
                      marginRight: 20,
                    }}
                    source={require('../../Images/folder.jpeg')}></Image>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                fontWeight: '600',
              }}>
              {'Full Name'}
            </Text>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TextInput
                value={fullName}
                placeholder=" full name"
                onChangeText={fullName => setFullName(fullName)}
                secureTextEntry={false}
                style={{
                  backgroundColor: '#eee7da',
                  marginHorizontal: 10,
                  marginBottom: 10,
                  marginTop: 5,
                  borderRadius: 5,
                  minHeight: 50,
                  borderWidth: 1,
                  borderColor: '#0c0b09',
                  width: screenWidth * 0.9,
                }}></TextInput>
              <Text
                style={{
                  textAlign: 'left',
                  marginLeft: 10,
                  fontWeight: '600',
                  marginTop: 10,
                }}>
                {'Phone Number'}
              </Text>
              <TextInput
                value={phoneNumber}
                placeholder=" phone number"
                onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                secureTextEntry={false}
                style={{
                  backgroundColor: '#eee7da',
                  marginHorizontal: 10,
                  marginBottom: 10,
                  marginTop: 5,
                  borderRadius: 5,
                  minHeight: 50,
                  borderWidth: 1,
                  borderColor: '#0c0b09',
                  width: screenWidth * 0.9,
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
                  backgroundColor: '#eee7da',
                  marginHorizontal: 10,
                  marginBottom: 10,
                  marginTop: 5,
                  borderRadius: 5,
                  minHeight: 50,
                  borderWidth: 1,
                  borderColor: '#0c0b09',
                  width: screenWidth * 0.9,
                }}></TextInput>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <View
                style={[
                  showCameraIcon && styles.circleBefore,
                  !showCameraIcon && styles.circleAfter,
                ]}>
                {showCameraIcon ? (
                  <Image
                    style={{
                      height: 75,
                      width: 75,
                      borderRadius: 5,
                    }}
                    source={require('../../Images/cameraIcon_Hollis.png')}></Image>
                ) : (
                  !showCameraIcon && (
                    <Image
                      style={{
                        height: 75,
                        width: 75,
                        borderRadius: 5,
                      }}
                      source={require('../../Images/checkIcon_Hollis.png')}></Image>
                  )
                )}
              </View>
              <View
                style={[
                  showCheckListIcon && styles.circleBefore,
                  !showCheckListIcon && styles.circleAfter,
                ]}>
                {showCheckListIcon ? (
                  <Image
                    style={{
                      height: 75,
                      width: 75,
                      borderRadius: 5,
                    }}
                    source={require('../../Images/checklistIcon_Hollis.png')}></Image>
                ) : (
                  !showCheckListIcon && (
                    <Image
                      style={{
                        height: 75,
                        width: 75,
                        borderRadius: 5,
                      }}
                      source={require('../../Images/checkIcon_Hollis.png')}></Image>
                  )
                )}
              </View>
              <View
                style={[
                  showFolderIcon && styles.circleBefore,
                  !showFolderIcon && styles.circleAfter,
                ]}>
                {showFolderIcon ? (
                  <Image
                    style={{
                      height: 75,
                      width: 75,
                      borderRadius: 5,
                    }}
                    source={require('../../Images/folderIcon_Hollis.png')}></Image>
                ) : (
                  !showFolderIcon && (
                    <Image
                      style={{
                        height: 75,
                        width: 75,
                        borderRadius: 5,
                      }}
                      source={require('../../Images/checkIcon_Hollis.png')}></Image>
                  )
                )}
              </View>
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
                color: '#eee7da',
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
              borderColor: '#0c0b09',
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
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {successMessage && !docPickerState ? (
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#eee7da',
                    fontWeight: '500',
                    fontSize: 16,
                    borderRadius: 5,
                    borderColor: '#0c0b09',
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
                !docPickerState && (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#eee7da',
                      fontWeight: '500',
                      fontSize: 18,
                      borderRadius: 5,
                    }}>
                    {'Do you want to edit your information?'}
                  </Text>
                )
              )}
              {docPickerState && (
                <DocPicker
                  toggleModal={toggleModal}
                  toggleDocPickerSwitch={toggleDocPickerSwitch}></DocPicker>
              )}
            </View>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {!docPickerState && (
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
                      color: '#eee7da',
                      fontSize: 21,
                      fontWeight: '600',
                      backgroundColor: 'blue',
                    }}>
                    {'Yes'}
                  </Text>
                </TouchableOpacity>
              )}
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
                    color: '#eee7da',
                    fontSize: 21,
                    fontWeight: '600',
                    backgroundColor: 'blue',
                    borderRadius: 5,
                  }}>
                  {!docPickerState ? 'No' : 'Cancel'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  circleBefore: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: '#eee7da',
    borderWidth: 1,
  },
  circleAfter: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: 'green',
  },
});

export default HomeScreen;
