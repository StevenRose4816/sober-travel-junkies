import {FC, useEffect, useRef, useState} from 'react';
import Contacts from 'react-native-contacts';
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
  FlatList,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {get, onValue, ref, set} from 'firebase/database';
import {useAppSelector} from '../../hooks';
import {db} from '../HomeScreen/FirebaseConfigurations';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setBackgroundPhoto, setUserPhoto} from '../../store/user/slice';
import {DocPicker} from '../../components/DocumentPicker';
import {setSelected} from '../../store/user/slice';
import {setSelectedDocument} from '../../store/document/slice';
import {setNewUser} from '../../store/globalStore/slice';
import {NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import Clipboard from '@react-native-clipboard/clipboard';

interface User {
  username: string;
  phoneNumber: string;
}

const HomeScreen: FC = () => {
  const navigation = useNavigation<NavPropAny>();
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;

  const logout = () => {
    dispatch(setUserPhoto({userPhoto: null}));
    dispatch(setSelectedDocument({selectedDocument: undefined}));
    dispatch(setNewUser({newUser: false}));
    auth().signOut();
  };

  const openPicker = () => {
    navigation.navigate(Routes.imagePicker);
  };

  const userId = auth().currentUser?.uid;
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [dataFlag, setDataFlag] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [initialName, setInitialName] = useState('');
  const [initialAddress, setInitialAddress] = useState('');
  const [initialPhoneNumber, setInitialPhoneNumber] = useState('');
  const [initialEmergencyContact, setInitialEmergencyContact] = useState('');
  const [initialEmergencyContactPhone, setInitialEmergencyContactPhone] =
    useState('');
  const [users, setUsers] = useState<User[]>([]);
  const names = users.filter(i => i.username !== '').map(i => i.username);
  console.log('names:', names);
  const numbs = users.filter(i => i.phoneNumber !== '').map(i => i.phoneNumber);
  console.log('numbs: ', numbs);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

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

  const toggleBackgroundPhotoModal = () => {
    setModalVisible2(!modalVisible2);
  };

  const create = async (userId: string | undefined) => {
    set(ref(db, 'users/' + userId), {
      username: fullName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      userPhoto: userPhoto || userPhotoFromDB,
      emergencyContact: emergencyContact,
      emergencyContactPhone: emergencyContactPhone,
      bio: bio,
    })
      .then(() => {
        console.log('db created/updated');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const readData = async () => {
    const countRef = ref(db, 'users/' + userId);
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setData(true);
        setDataFlag(true);
        setAddress(data.address || '');
        setFullName(data.username || '');
        setPhoneNumber(data.phoneNumber || '');
        setUserPhotoFromDB(data.userPhoto || '');
        setEmergencyContact(data.emergencyContact || '');
        setEmergencyContactPhone(data.emergencyContactPhone || '');
        setBio(data.bio || '');
        setInitialBio(data.bio || '');
        setInitialName(data.username || '');
        setInitialAddress(data.address || '');
        setInitialPhoneNumber(data.phoneNumber || '');
        setInitialEmergencyContact(data.emergencyContact || '');
        setInitialEmergencyContactPhone(data.emergencyContactPhone || '');
      } else {
        console.log('No data available');
        setDataFlag(false);
      }
    } catch (error) {
      console.error('Error reading data from the database:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        showBackButton && (
          <TouchableOpacity
            onPress={onPressGoBack}
            style={{
              width: 20,
            }}>
            <Image
              source={require('../../Images/caret_left.png')}
              style={{
                height: 20,
                width: 20,
              }}></Image>
          </TouchableOpacity>
        ),
      headerRight: () => (
        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: '#b6e7cc',
            borderRadius: 5,
            width: 65,
          }}>
          <Text
            style={{
              color: '#0c0b09',
              textAlign: 'center',
              marginTop: 5,
              marginBottom: 5,
              fontSize: 12,
              fontFamily: 'HighTide-Sans',
            }}>
            {'Log out'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, showBackButton]);

  useEffect(() => {
    readData();
    fetchAllUsersData();
    moveImage();
  }, [users]);

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
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [userPhotoFromDB, setUserPhotoFromDB] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [docPickerState, setDocPickerState] = useState(false);
  const [showCameraIcon, setShowCameraIcon] = useState(true);
  const [showCheckListIcon, setShowCheckListIcon] = useState(true);
  const [showFolderIcon, setShowFolderIcon] = useState(true);
  const photoSelected = useAppSelector(state => state.user.selected);
  const selectedDocument = useAppSelector(
    state => state.document.selectedDocument,
  );
  const [firstPhotoPressed, setFirstPhotoPressed] = useState(false);
  const [secondPhotoPressed, setSecondPhotoPressed] = useState(false);
  const [thirdPhotoPressed, setThirdPhotoPressed] = useState(false);
  const [fourthPhotoPressed, setFourthPhotoPressed] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [contacts, setContacts] = useState<Contacts.Contact[] | null>(null);

  const [showTripModal, setShowTripModal] = useState(false);
  const [bio, setBio] = useState('');
  const [initialBio, setInitialBio] = useState('');
  const newUser = useAppSelector(state => state.globalStore.newUser);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'ContactsList app would like to access your contacts.',
        buttonPositive: 'Accept',
      }).then(value => {
        if (value === 'granted') {
          Contacts.getAll().then(contacts => {
            setContacts(contacts);
            console.log('contacts: ', contacts);
          });
        }
      });
    } else {
      Contacts.getAll().then(contacts => {
        setContacts(contacts);
        console.log('contacts: ', contacts);
      });
    }
  }, []);

  const checkName = () => {
    if (
      initialName !== fullName ||
      initialAddress !== address ||
      initialPhoneNumber !== phoneNumber ||
      initialEmergencyContact !== emergencyContact ||
      initialEmergencyContactPhone !== emergencyContactPhone ||
      initialBio !== bio
    ) {
      setShowCheckListIcon(false);
    } else {
      console.log('None of the TextInputs have changed.');
    }
  };

  useEffect(() => {
    console.log('userPhoto: ', userPhoto);
    console.log('userPhotoFromDB: ', userPhotoFromDB);
  }, [userPhoto, userPhotoFromDB]);

  useEffect(() => {
    if (!dataFlag) {
      fadeIn();
    }
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
  }, [dataFlag]);

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
    setDataFlag(dataFlag => !dataFlag);
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
    dispatch(setSelectedDocument({selectedDocument: undefined}));
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
    newUser && dispatch(setNewUser({newUser: false}));
    console.log('Submit pressed.');
  };

  const onPressChangeBackground = () => {
    toggleBackgroundPhotoModal();
  };

  const onPressFirstBackgroundPhoto = () => {
    secondPhotoPressed && setSecondPhotoPressed(false);
    thirdPhotoPressed && setThirdPhotoPressed(false);
    fourthPhotoPressed && setFourthPhotoPressed(false);
    setFirstPhotoPressed(true);
    source();
  };

  const onPressSecondBackgroundPhoto = () => {
    firstPhotoPressed && setFirstPhotoPressed(false);
    thirdPhotoPressed && setThirdPhotoPressed(false);
    fourthPhotoPressed && setFourthPhotoPressed(false);
    setSecondPhotoPressed(true);
    source();
  };

  const onPressThirdBackgroundPhoto = () => {
    firstPhotoPressed && setFirstPhotoPressed(false);
    secondPhotoPressed && setSecondPhotoPressed(false);
    fourthPhotoPressed && setFourthPhotoPressed(false);
    setThirdPhotoPressed(true);
    source();
  };

  const onPressFourthBackgroundPhoto = () => {
    firstPhotoPressed && setFirstPhotoPressed(false);
    secondPhotoPressed && setSecondPhotoPressed(false);
    thirdPhotoPressed && setThirdPhotoPressed(false);
    setFourthPhotoPressed(true);
    source();
  };

  const onPressTripInfo = () => {
    setShowTripModal(true);
    toggleBackgroundPhotoModal();
  };

  const toggleDocPickerSwitch = () => {
    setDocPickerState(previousState => !previousState);
    toggleModal();
  };

  const onPressCloseModal = () => {
    toggleBackgroundPhotoModal();
    showTripModal && setShowTripModal(false);
    modalVisible3 && setModalVisible3(false);
  };

  const source = () => {
    if (firstPhotoPressed) {
      const background1 = require('../../Images/backgroundPhoto1.jpeg');
      return background1;
    } else if (secondPhotoPressed) {
      const background2 = require('../../Images/backgroundPhoto2.jpeg');
      return background2;
    } else if (thirdPhotoPressed) {
      const background3 = require('../../Images/backgroundPhoto3.jpeg');
      return background3;
    } else if (fourthPhotoPressed) {
      const background4 = require('../../Images/backgroundPhoto4.jpeg');
      return background4;
    } else {
      const background1 = require('../../Images/backgroundPhoto1.jpeg');
      return background1;
    }
  };

  const onPressTripDest = () => {
    navigation.navigate(Routes.booneScreen, {backgroundPhoto: source()});
    setShowTripModal(false);
    toggleBackgroundPhotoModal();
  };

  const onPressMessageBoard = () => {
    navigation.navigate(Routes.messageBoardScreen, {
      fullName: fullName,
      userPhotoFromDB: userPhotoFromDB,
      backgroundPhoto: source(),
    });
  };

  const onPressGroupContactInfo = () => {
    fetchAllUsersData();
    setModalVisible2(true);
    setModalVisible3(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersArray = await fetchAllUsersData();
        setUsers(usersArray);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const fetchAllUsersData = async () => {
    const usersRef = ref(db, 'users');
    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.keys(usersData).map(userId => {
          const userData = usersData[userId];
          return {
            username: userData.username,
            phoneNumber: userData.phoneNumber,
          };
        });
        console.log('usersArray: ', usersArray);
        return usersArray;
      } else {
        console.log('No users available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching users data:', error);
      return [];
    }
  };

  const copyToClipboard = (users: User[]) => {
    Clipboard.setString(JSON.stringify(users));
    console.log('String copied to clipboard:', JSON.stringify(users));
  };

  // const openContacts = () => {
  //   if (Platform.OS === 'android') {
  //     Linking.openURL('content://com.android.contacts/contacts');
  //   } else if (Platform.OS === 'ios') {
  //     Contacts.openContactForm();
  //   }
  // };

  return (
    <View style={{flex: 1, backgroundColor: '#eee7da'}}>
      {(data || newUser) && (
        <ScrollView
          ref={scrollViewRef}
          style={{flex: 1, backgroundColor: 'transparent'}}>
          <ImageBackground
            style={{flex: 1}}
            imageStyle={{opacity: 0.3}}
            source={source()}>
            <View style={styles.nestedView1}>
              <Animated.Image
                style={{
                  height: 150,
                  width: 300,
                  opacity: fadeAnim,
                }}
                source={require('../../Images/STJLogoTransparent.png')}></Animated.Image>
            </View>
            {dataFlag && (
              <>
                {userPhotoFromDB !== '' ? (
                  <Animated.Image
                    style={{
                      height: 200,
                      width: 200,
                      marginLeft: 10,
                      marginBottom: 10,
                      borderRadius: 5,
                      opacity: fadeAnim,
                      borderColor: '#eee7da',
                      borderWidth: 2,
                    }}
                    source={{uri: userPhotoFromDB}}></Animated.Image>
                ) : (
                  <Animated.Image
                    style={{
                      height: 200,
                      width: 200,
                      borderRadius: 5,
                      marginLeft: 10,
                      marginBottom: 10,
                      opacity: fadeAnim,
                      borderColor: '#eee7da',
                      borderWidth: 2,
                    }}
                    source={
                      (userPhoto === '' && {uri: userPhoto}) ||
                      require('../../Images/profilepictureicon.png')
                    }></Animated.Image>
                )}
                <TouchableOpacity
                  onPress={onPressTripInfo}
                  style={{
                    backgroundColor: '#b6e7cc',
                    marginLeft: 10,
                    marginTop: 10,
                    width: 250,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#eee7da',
                  }}>
                  <Text style={styles.text2}>{'Register For A Trip'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPressMessageBoard}
                  style={{
                    backgroundColor: '#b6e7cc',
                    marginLeft: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    width: 250,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#eee7da',
                  }}>
                  <Text style={styles.text2}>{'View Message Board'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPressGroupContactInfo}
                  style={{
                    backgroundColor: '#b6e7cc',
                    marginLeft: 10,
                    marginBottom: 10,
                    width: 250,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#eee7da',
                  }}>
                  <Text style={styles.text2}>{'Get Group Contact Info'}</Text>
                </TouchableOpacity>

                <View style={styles.nestedView2}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginLeft: 10,
                      marginRight: 10,
                      marginTop: 10,
                      backgroundColor: '#b6e7cc',
                      borderRadius: 5,
                    }}>
                    <Image
                      style={{width: 40, height: 40, marginLeft: 10}}
                      source={require('../../Images/homeaddressicon.png')}></Image>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Address: '}
                      <Text style={{fontFamily: 'Vonique64'}}>{address}</Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: '#b6e7cc',
                      margin: 10,
                      borderRadius: 5,
                    }}>
                    <Image
                      style={{width: 40, height: 40, marginLeft: 10}}
                      source={require('../../Images/emailaddressicon.png')}></Image>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                        maxWidth: screenWidth * 0.7,
                      }}>
                      {'Email Address: '}
                      <Text style={{fontFamily: 'Vonique64'}}>{email}</Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: '#b6e7cc',
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 5,
                    }}>
                    <Image
                      style={{width: 40, height: 40, marginLeft: 10}}
                      source={require('../../Images/phonenumbericon.png')}></Image>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                        maxWidth: screenWidth * 0.7,
                      }}>
                      {'Phone number: '}
                      <Text style={{fontFamily: 'Vonique64'}}>
                        {phoneNumber}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: '#b6e7cc',
                      margin: 10,
                      borderRadius: 5,
                    }}>
                    <Image
                      style={{width: 40, height: 40, marginLeft: 10}}
                      source={require('../../Images/appicon.png')}></Image>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                        maxWidth: screenWidth * 0.7,
                      }}>
                      {'Full name: '}
                      <Text style={{fontFamily: 'Vonique64'}}>{fullName}</Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                      backgroundColor: '#b6e7cc',
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        marginBottom: 10,
                        fontFamily: 'HighTide-Sans',
                        maxWidth: screenWidth * 0.7,
                      }}>
                      {'Emergency Contact Name: '}
                      <Text style={{fontFamily: 'Vonique64'}}>
                        {emergencyContact}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#b6e7cc',
                      margin: 10,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        marginBottom: 10,
                        fontFamily: 'HighTide-Sans',
                        maxWidth: screenWidth * 0.7,
                      }}>
                      {'Emergency Contact Phone: '}
                      <Text style={{fontFamily: 'Vonique64'}}>
                        {emergencyContactPhone}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#eee7da',
                    margin: 10,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      marginBottom: 10,
                      marginTop: 10,
                      fontFamily: 'HighTide-Sans',
                      maxWidth: screenWidth * 0.7,
                    }}>
                    {'Bio: '}
                    <Text style={{fontFamily: 'Vonique64'}}>{bio}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onEditPress}
                  style={{
                    backgroundColor: '#b6e7cc',
                    borderRadius: 5,
                    marginLeft: screenWidth * 0.72,
                    marginBottom: 20,
                    width: 100,
                    borderWidth: 1,
                    borderColor: '#eee7da',
                  }}>
                  <Text
                    style={{
                      color: '#0c0b09',
                      fontSize: 12,
                      fontWeight: '600',
                      margin: 10,
                      textAlign: 'center',
                      fontFamily: 'HighTide-Sans',
                    }}>
                    {'Edit'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {(!dataFlag || newUser) && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginBottom: 10,
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
                        !userPhoto
                          ? require('../../Images/profilepictureicon.png')
                          : {uri: userPhoto}
                      }
                    />
                  ) : (
                    <Animated.Image
                      style={{
                        height: 300,
                        width: screenWidth * 0.95,
                        borderRadius: 5,
                        opacity: fadeAnim,
                        borderColor: '#eee7da',
                        borderWidth: 2,
                      }}
                      source={{uri: userPhoto || userPhotoFromDB}}
                    />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <View style={styles.nestedView3}>
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
                  <View style={styles.nestedView4}>
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
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      onPress={onPressChangeBackground}
                      style={{
                        backgroundColor: '#b6e7cc',
                        marginLeft: 10,
                        marginTop: 10,
                        width: 250,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#eee7da',
                      }}>
                      <Text style={styles.text1}>
                        {'Change background photo'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'HighTide-Sans',
                      marginLeft: 25,
                      marginTop: 10,
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
                      fontFamily: 'HighTide-Sans',
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
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'flex-start',
                    }}>
                    <Text
                      style={{
                        marginLeft: 25,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Phone Number'}
                    </Text>
                  </View>
                  <TextInput
                    value={phoneNumber}
                    placeholder=" phone number"
                    onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                    secureTextEntry={false}
                    style={{
                      fontFamily: 'HighTide-Sans',
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
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'flex-start',
                    }}>
                    <Text
                      style={{
                        marginLeft: 25,
                        marginTop: 10,
                        fontWeight: '600',
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Address'}
                    </Text>
                  </View>
                  <TextInput
                    value={address}
                    placeholder=" address"
                    onChangeText={address => setAddress(address)}
                    secureTextEntry={false}
                    style={{
                      fontFamily: 'HighTide-Sans',
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
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'flex-start',
                    }}>
                    <Text
                      style={{
                        marginLeft: 25,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Emergency Contact Name'}
                    </Text>
                  </View>
                  <TextInput
                    value={emergencyContact}
                    placeholder=" emergency contact name"
                    onChangeText={emergencyContact =>
                      setEmergencyContact(emergencyContact)
                    }
                    secureTextEntry={false}
                    style={{
                      fontFamily: 'HighTide-Sans',
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
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'flex-start',
                    }}>
                    <Text
                      style={{
                        marginLeft: 25,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Emergency Contact Phone'}
                    </Text>
                  </View>
                  <TextInput
                    value={emergencyContactPhone}
                    placeholder=" emergency contact phone"
                    onChangeText={emergencyContactPhone =>
                      setEmergencyContactPhone(emergencyContactPhone)
                    }
                    secureTextEntry={false}
                    style={{
                      fontFamily: 'HighTide-Sans',
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
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'flex-start',
                    }}>
                    <Text
                      style={{
                        marginLeft: 25,
                        marginTop: 10,
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Bio'}
                    </Text>
                  </View>
                  <TextInput
                    value={bio}
                    placeholder=" bio"
                    onChangeText={bio => setBio(bio)}
                    secureTextEntry={false}
                    multiline={true}
                    maxLength={2000}
                    style={{
                      fontFamily: 'HighTide-Sans',
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
                <View style={styles.nestedView6}>
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
      )}
      <Modal
        visible={modalVisible}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.modalView1}>
          <View style={styles.modalView2}>
            <View style={styles.modalView3}>
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
                  {'Are you sure you want to make this change? '}
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
            <View style={styles.modalView4}>
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
      <Modal
        visible={modalVisible2}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleBackgroundPhotoModal}>
        <View style={styles.modalView5}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              backgroundColor: '#b6e7cc',
              height: 400,
              width: '80%',
              borderRadius: 5,
            }}>
            <TouchableOpacity
              onPress={onPressCloseModal}
              style={{position: 'absolute', top: 10, right: 15}}>
              <Image
                style={{height: 25, width: 25}}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
            {!showTripModal && !modalVisible3 && (
              <>
                <TouchableOpacity
                  style={{marginTop: 50}}
                  onPress={onPressFirstBackgroundPhoto}>
                  <Image
                    style={[
                      !firstPhotoPressed && styles.backgroundBefore,
                      firstPhotoPressed && styles.backgroundAfter,
                    ]}
                    source={require('../../Images/backgroundPhoto1.jpeg')}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPressSecondBackgroundPhoto}
                  style={{marginTop: 50}}>
                  <Image
                    style={[
                      !secondPhotoPressed && styles.backgroundBefore,
                      secondPhotoPressed && styles.backgroundAfter,
                    ]}
                    source={require('../../Images/backgroundPhoto2.jpeg')}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPressThirdBackgroundPhoto}
                  style={{marginTop: 50}}>
                  <Image
                    style={[
                      !thirdPhotoPressed && styles.backgroundBefore,
                      thirdPhotoPressed && styles.backgroundAfter,
                    ]}
                    source={require('../../Images/backgroundPhoto3.jpeg')}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPressFourthBackgroundPhoto}
                  style={{marginTop: 50}}>
                  <Image
                    style={[
                      !fourthPhotoPressed && styles.backgroundBefore,
                      fourthPhotoPressed && styles.backgroundAfter,
                    ]}
                    source={require('../../Images/backgroundPhoto4.jpeg')}></Image>
                </TouchableOpacity>
              </>
            )}
            {showTripModal && !modalVisible3 && (
              <>
                <TouchableOpacity
                  style={{
                    height: 100,
                    width: screenWidth * 0.4,
                    marginRight: 10,
                    marginTop: 60,
                    marginLeft: 10,
                    backgroundColor: '#eee7da',
                    borderRadius: 5,
                  }}
                  onPress={onPressTripDest}>
                  <Text
                    style={{
                      borderRadius: 5,
                      textAlign: 'center',
                      marginTop: 40,
                      marginBottom: 10,
                      fontFamily: 'HighTide-Sans',
                      fontSize: 18,
                    }}>
                    {"Valle Crucis 24'"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 100,
                    width: screenWidth * 0.4,
                    marginRight: 10,
                    marginTop: 60,
                    marginLeft: 10,
                    backgroundColor: '#eee7da',
                    borderRadius: 5,
                  }}
                  onPress={onPressTripDest}>
                  <Text
                    style={{
                      borderRadius: 5,
                      textAlign: 'center',
                      marginTop: 40,
                      marginBottom: 10,
                      fontFamily: 'HighTide-Sans',
                      fontSize: 18,
                    }}>
                    {"Cozumel 25'"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {modalVisible3 && (
              <View style={{marginTop: 10}}>
                <FlatList
                  data={users}
                  renderItem={({item}) => (
                    <View style={{width: screenWidth * 0.6, marginTop: 20}}>
                      <Text
                        style={{
                          borderRadius: 5,
                          textAlign: 'left',
                          marginTop: 10,
                          marginBottom: 10,
                          fontFamily: 'HighTide-Sans',
                          fontSize: 18,
                        }}>
                        {item.username}
                      </Text>
                      <Text
                        style={{
                          borderRadius: 5,
                          textAlign: 'left',
                          marginTop: 10,
                          marginBottom: 10,
                          fontFamily: 'HighTide-Sans',
                          fontSize: 18,
                        }}>
                        {item.phoneNumber}
                      </Text>
                    </View>
                  )}
                  keyExtractor={item => item.username}
                />
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(users)}
                    style={{
                      backgroundColor: '#b6e7cc',
                      borderRadius: 5,
                      marginBottom: 20,
                      width: 100,
                      borderWidth: 1,
                      borderColor: '#eee7da',
                    }}>
                    <Text
                      style={{
                        color: '#0c0b09',
                        fontSize: 12,
                        fontWeight: '600',
                        margin: 10,
                        textAlign: 'center',
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Copy to Clipboard'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => console.log('add new contact pressed')}
                    style={{
                      backgroundColor: '#b6e7cc',
                      borderRadius: 5,
                      marginBottom: 20,
                      width: 100,
                      borderWidth: 1,
                      borderColor: '#eee7da',
                    }}>
                    <Text
                      style={{
                        color: '#0c0b09',
                        fontSize: 12,
                        fontWeight: '600',
                        margin: 10,
                        textAlign: 'center',
                        fontFamily: 'HighTide-Sans',
                      }}>
                      {'Add to Contacts'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  backgroundBefore: {
    height: 125,
    width: 125,
    borderRadius: 5,
  },
  backgroundAfter: {
    height: 125,
    width: 125,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: '#f86ca7',
  },
  nestedView1: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  nestedView2: {
    // backgroundColor: '#eee7da',
    backgroundColor: '#eee7da',
    margin: 10,
    borderRadius: 5,
  },
  nestedView3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    backgroundColor: '#eee7da',
    borderRadius: 5,
  },
  nestedView4: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#eee7da',
    borderRadius: 5,
  },
  nestedView5: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nestedView6: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView2: {
    borderColor: '#0c0b09',
    backgroundColor: '#b6e7cc',
    minHeight: 300,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 20,
  },
  modalView3: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eee7da',
    borderWidth: 2,
  },
  modalView4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView5: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView6: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    backgroundColor: '#b6e7cc',
    height: 300,
    width: '80%',
    borderRadius: 5,
  },
  text1: {
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'HighTide-Sans',
  },
  text2: {
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
    textAlign: 'left',
    fontFamily: 'HighTide-Sans',
  },
});

export default HomeScreen;
