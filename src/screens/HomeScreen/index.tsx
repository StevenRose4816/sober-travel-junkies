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
  Animated,
  ImageBackground,
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
  const [initialEmergencyContact, setInitialEmergencyContact] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  // const fadeOut = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // };

  const moveImage = () => {
    Animated.timing(translateX, {
      toValue: screenWidth * 0.37,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  function create(userId: string | undefined) {
    set(ref(db, 'users/' + userId), {
      username: fullName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      userPhoto: userPhoto || userPhotoFromDB,
      emergencyContact: emergencyContact,
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
        setEmergencyContact(data.emergencyContact);
        setInitialName(data.username);
        setInitialAddress(data.address);
        setInitialPhoneNumber(data.phoneNumber);
        setInitialEmergencyContact(data.emergencyContact);
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
              width: 40,
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
    fadeIn();
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
  const [emergencyContact, setEmergencyContact] = useState('');
  const [userPhotoFromDB, setUserPhotoFromDB] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [docPickerState, setDocPickerState] = useState(false);
  const [showCameraIcon, setShowCameraIcon] = useState(true);
  const [showCheckListIcon, setShowCheckListIcon] = useState(true);
  const [showFolderIcon, setShowFolderIcon] = useState(true);
  const [changeBackground, setChangeBackground] = useState(false);
  const photoSelected = useAppSelector(state => state.photo.selected);
  const selectedDocument = useAppSelector(
    state => state.document.selectedDocument,
  );

  const checkName = () => {
    if (
      initialName !== fullName ||
      initialAddress !== address ||
      initialPhoneNumber !== phoneNumber ||
      initialEmergencyContact !== emergencyContact
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
    fadeAnim.setValue(0);
  };

  const onPressYes = () => {
    translateX.setValue(0);
    moveImage();
    fadeAnim.setValue(0);
    fadeIn();
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

  const onPressChangeBackground = () => {
    setChangeBackground(previousstate => !previousstate);
  };

  const onPressTripInfo = () => {
    navigate('TripInfo Screen');
  };

  const toggleDocPickerSwitch = () => {
    setDocPickerState(previousState => !previousState);
    toggleModal();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#eee7da'}}>
      <ScrollView style={{flex: 1, backgroundColor: 'transparent'}}>
        <ImageBackground
          style={{flex: 1}}
          imageStyle={{opacity: 0.3}}
          source={
            !changeBackground
              ? require('../../Images/backgroundPhoto1.jpeg')
              : require('../../Images/backgroundPhoto2.jpeg')
          }>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                height: 150,
                width: 150,
              }}
              source={require('../../Images/STJ.png')}></Image>
          </View>
          {dataFlag && (
            <>
              {userPhotoFromDB ? (
                <Animated.Image
                  style={{
                    height: 300,
                    width: screenWidth * 0.95,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                    opacity: fadeAnim,
                  }}
                  source={{uri: userPhotoFromDB}}></Animated.Image>
              ) : (
                <Animated.Image
                  style={{
                    height: 300,
                    width: screenWidth * 0.95,
                    borderRadius: 5,
                    marginLeft: 10,
                    marginBottom: 10,
                    opacity: fadeAnim,
                  }}
                  source={require('../../Images/profile-picture-vector.jpeg')}></Animated.Image>
              )}
              <TouchableOpacity
                onPress={onPressChangeBackground}
                style={{
                  backgroundColor: '#eee7da',
                  marginLeft: 10,
                  marginRight: screenWidth * 0.4,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    borderRadius: 5,
                    marginTop: 10,
                    marginLeft: 10,
                    marginBottom: 10,
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Change background photo'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPressTripInfo}
                style={{
                  backgroundColor: '#eee7da',
                  marginLeft: 10,
                  marginTop: 10,
                  marginRight: screenWidth * 0.4,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    borderRadius: 5,
                    marginTop: 10,
                    marginLeft: 10,
                    marginBottom: 10,
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Trip Information'}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 10,
                  fontWeight: '700',
                  fontFamily: 'HighTide-Sans',
                }}>
                {'Address: '}
                <Text style={{fontWeight: '300', fontFamily: 'Vonique64'}}>
                  {address}
                </Text>
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 10,
                  fontFamily: 'HighTide-Sans',
                }}>
                {'Phone number: '}
                <Text style={{fontWeight: '300', fontFamily: 'Vonique64'}}>
                  {phoneNumber}
                </Text>
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 10,
                  fontFamily: 'HighTide-Sans',
                }}>
                {'Full name: '}
                <Text style={{fontFamily: 'Vonique64'}}>{fullName}</Text>
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  fontFamily: 'HighTide-Sans',
                }}>
                {'Emergency Contact Name: '}
                <Text style={{fontFamily: 'Vonique64'}}>
                  {emergencyContact}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={onEditPress}
                style={{
                  backgroundColor: 'blue',
                  borderRadius: 5,
                  marginLeft: screenWidth * 0.72,
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
                    fontFamily: 'Vonique64',
                  }}>
                  {'Edit'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {!dataFlag && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 10,
                  textAlign: 'left',
                  marginBottom: 20,
                  fontWeight: '600',
                  fontFamily: 'Vonique64',
                }}>
                {"Let's get some informaton."}
              </Text>
              <View style={{flex: 1, alignItems: 'center'}}>
                {!userPhotoFromDB ? (
                  <Animated.Image
                    style={{
                      height: 300,
                      width: screenWidth * 0.95,
                      borderRadius: 5,
                      opacity: fadeAnim,
                    }}
                    source={
                      {uri: userPhoto} ||
                      require('../../Images/profile-picture-vector.jpeg')
                    }
                  />
                ) : (
                  <Animated.Image
                    style={{
                      height: 300,
                      width: screenWidth * 0.95,
                      borderRadius: 5,
                      opacity: fadeAnim,
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
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 20,
                    backgroundColor: '#eee7da',
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      fontSize: 20,
                      fontFamily: 'Vonique64',
                    }}>
                    {'Upload Photo ?'}
                  </Text>
                  <TouchableOpacity onPress={openPicker}>
                    <Animated.Image
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 5,
                        marginRight: 20,
                        transform: [{translateX}],
                      }}
                      source={require('../../Images/camerapictureicon.png')}></Animated.Image>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                    backgroundColor: '#eee7da',
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      fontSize: 20,
                      fontFamily: 'Vonique64',
                    }}>
                    {'Upload NDA?'}
                  </Text>
                  <TouchableOpacity onPress={toggleDocPickerSwitch}>
                    <Animated.Image
                      style={{
                        marginLeft: 23,
                        height: 50,
                        width: 50,
                        borderRadius: 5,
                        transform: [{translateX}],
                      }}
                      source={require('../../Images/ndaicon.png')}></Animated.Image>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Full Name'}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  value={fullName}
                  placeholder=" full name"
                  onChangeText={fullName => setFullName(fullName)}
                  secureTextEntry={false}
                  style={{
                    fontFamily: 'Vonique64',
                    backgroundColor: '#eee7da',
                    marginHorizontal: 10,
                    marginBottom: 10,
                    marginTop: 5,
                    borderRadius: 5,
                    minHeight: 50,
                    borderWidth: 1,
                    borderColor: '#5A6472',
                    borderBottomWidth: 3,
                    width: screenWidth * 0.9,
                  }}></TextInput>
                <Text
                  style={{
                    textAlign: 'left',
                    marginLeft: 10,
                    fontWeight: '600',
                    marginTop: 10,
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Phone Number'}
                </Text>
                <TextInput
                  value={phoneNumber}
                  placeholder=" phone number"
                  onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                  secureTextEntry={false}
                  style={{
                    fontFamily: 'Vonique64',
                    backgroundColor: '#eee7da',
                    marginHorizontal: 10,
                    marginBottom: 10,
                    marginTop: 5,
                    borderRadius: 5,
                    minHeight: 50,
                    borderWidth: 1,
                    borderColor: '#5A6472',
                    borderBottomWidth: 3,
                    width: screenWidth * 0.9,
                  }}></TextInput>
                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    fontWeight: '600',
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Address'}
                </Text>
                <TextInput
                  value={address}
                  placeholder=" address"
                  onChangeText={address => setAddress(address)}
                  secureTextEntry={false}
                  style={{
                    fontFamily: 'Vonique64',
                    backgroundColor: '#eee7da',
                    marginHorizontal: 10,
                    marginBottom: 10,
                    marginTop: 5,
                    borderRadius: 5,
                    minHeight: 50,
                    borderWidth: 1,
                    borderBottomWidth: 3,
                    borderColor: '#5A6472',
                    width: screenWidth * 0.9,
                  }}></TextInput>
                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Emergency Contact Name'}
                </Text>
                <TextInput
                  value={emergencyContact}
                  placeholder=" emergency contact"
                  onChangeText={emergencyContact =>
                    setEmergencyContact(emergencyContact)
                  }
                  secureTextEntry={false}
                  style={{
                    fontFamily: 'Vonique64',
                    backgroundColor: '#eee7da',
                    marginHorizontal: 10,
                    marginBottom: 10,
                    marginTop: 5,
                    borderRadius: 5,
                    minHeight: 50,
                    borderWidth: 1,
                    borderBottomWidth: 3,
                    borderColor: '#5A6472',
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
                  fontFamily: 'Vonique64',
                }}>
                {'Submit'}
              </Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
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
                    fontFamily: 'Vonique64',
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
                      fontFamily: 'Vonique64',
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
                      fontFamily: 'Vonique64',
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
                    fontFamily: 'Vonique64',
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
