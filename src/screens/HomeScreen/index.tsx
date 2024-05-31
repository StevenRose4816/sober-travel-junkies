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
  Animated,
  ImageBackground,
  FlatList,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {get, onValue, ref, set} from 'firebase/database';
import {useAppSelector} from '../../hooks';
import {db} from '../../Firebase/FirebaseConfigurations';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../../store/user/slice';
import {DocPicker} from '../../components/DocumentPicker';
import {setSelected} from '../../store/user/slice';
import {setSelectedDocument} from '../../store/document/slice';
import {setNewUser, setVisionBoardUrl} from '../../store/globalStore/slice';
import {NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  setHaveContactsBeenAdded,
  setContacts as setTheseContacts,
} from '../../store/contacts/index';
import {getDownloadURL, getStorage, ref as thisRef} from 'firebase/storage';
import styles from './styles';

export interface User {
  username?: string;
  familyName: string;
  givenName: string;
  phoneNumbers: {
    mobile: string;
    main: string;
    homeFax: string;
    work: string;
    home: string;
  };
}

const HomeScreen: FC = () => {
  const navigation = useNavigation<NavPropAny>();
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const logout = () => {
    dispatch(setUserPhoto({userPhoto: null}));
    dispatch(setSelectedDocument({selectedDocument: undefined}));
    dispatch(setNewUser({newUser: false}));
    dispatch(setHaveContactsBeenAdded({haveContactsBeenAdded: false}));
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [visionBoardPhoto, setVisionBoardPhoto] = useState<string | undefined>(
    undefined,
  );

  const readFromStorage1 = async (imageName: string) => {
    const storage = getStorage();
    const reference = thisRef(storage, imageName);
    try {
      await getDownloadURL(reference).then(url => {
        setUrl(url);
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const readFromStorage2 = async (imageName: string) => {
    const storage = getStorage();
    const reference = thisRef(storage, imageName);
    try {
      await getDownloadURL(reference).then(url => {
        setVisionBoardPhoto(url);
        dispatch(setVisionBoardUrl({visionBoardUrl: url}));
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

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

  const writeToRealTimeDB = async (userId: string | undefined) => {
    set(ref(db, 'users/' + userId), {
      username: fullName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      userPhoto: url || undefined,
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

  const readDataFromRealTimeDB = async () => {
    const countRef = ref(db, 'users/' + userId);
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setData(true);
        setDataFlag(true);
        setAddress(data.address);
        setFullName(data.username);
        setPhoneNumber(data.phoneNumber);
        setUserPhotoFromDB(data.userPhoto);
        setEmergencyContact(data.emergencyContact);
        setEmergencyContactPhone(data.emergencyContactPhone);
        setBio(data.bio);
        setInitialBio(data.bio);
        setInitialName(data.username);
        setInitialAddress(data.address);
        setInitialPhoneNumber(data.phoneNumber);
        setInitialEmergencyContact(data.emergencyContact);
        setInitialEmergencyContactPhone(data.emergencyContactPhone);
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
          <TouchableOpacity onPress={onPressGoBack} style={styles.touchable18}>
            <Image
              source={require('../../Images/caret_left.png')}
              style={styles.image13}></Image>
          </TouchableOpacity>
        ),
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={styles.touchable19}>
          <Text style={styles.text40}>{'Log out'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, showBackButton]);

  useEffect(() => {
    readDataFromRealTimeDB();
    fetchJSONDataForContactInfo();
    moveImage();
    readFromStorage2('visionBoardScreenShot');
  }, [users]);

  useEffect(() => {
    fadeIn();
    if (dataFlag) {
      setShowCheckListIcon(true);
    } else if (!dataFlag) {
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
  const [contacts, setContacts] = useState<Contacts.Contact[] | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [bio, setBio] = useState('');
  const [initialBio, setInitialBio] = useState('');
  const newUser = useAppSelector(state => state.globalStore.newUser);
  const contactsFromState = useAppSelector(state => state.contacts.contacts);
  const haveContactsBeenAdded = useAppSelector(
    state => state.contacts.haveContactsBeenAdded,
  );
  const messages = useAppSelector(state => state.user.messages);
  const visionBoardFromState = useAppSelector(
    state => state.globalStore.visionBoardUrl,
  );

  useEffect(() => {
    console.log('visionBoardFromState: ', visionBoardFromState);
  }, [visionBoardFromState]);

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
            dispatch(setTheseContacts({contacts}));
          });
        }
      });
    } else {
      Contacts.getAll().then(contacts => {
        setContacts(contacts);
        dispatch(setTheseContacts({contacts}));
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
    writeToRealTimeDB(userId);
    readDataFromRealTimeDB();
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
    // modalVisible3 && setModalVisible3(false);
    // setShowTripModal(true);
    // toggleBackgroundPhotoModal();
    navigation.navigate(Routes.home_Screen);
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
      userPhotoFromDB: url || userPhotoFromDB,
      backgroundPhoto: source(),
    });
  };

  const onPressGroupContactInfo = () => {
    fetchJSONDataForContactInfo();
    setModalVisible2(true);
    setModalVisible3(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersArray = await fetchJSONDataForContactInfo();
        setUsers(usersArray);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
    readFromStorage1(userId + '_profilePic');
  }, []);

  const fetchJSONDataForContactInfo = async () => {
    const usersRef = ref(db, 'users');
    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.keys(usersData).map(userId => {
          const userData = usersData[userId];
          return {
            username: userData.username,
            familyName: userData.username,
            givenName: '',
            phoneNumbers: {
              mobile: '',
              main: userData.phoneNumber,
              homeFax: '',
              work: '',
              home: '',
            },
          };
        });
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
  };

  const onPressOpenContacts = () => {
    navigation.navigate(Routes.contactScreen, {contacts, users, names});
    setModalVisible2(!modalVisible2);
  };

  return (
    <View style={styles.view1}>
      {(data || newUser) && (
        <ScrollView ref={scrollViewRef} style={styles.scrollView1}>
          <ImageBackground
            style={styles.imageBackground2}
            imageStyle={styles.imageBackground1}
            source={source()}>
            <View style={styles.nestedView1}>
              <Animated.Image
                style={[
                  styles.animated1,
                  {
                    opacity: fadeAnim,
                  },
                ]}
                source={require('../../Images/STJLogoTransparent.png')}></Animated.Image>
            </View>
            {dataFlag && (
              <>
                <View style={styles.view2}>
                  {!!url ? (
                    <Animated.Image
                      style={[
                        styles.animated2,
                        {
                          opacity: fadeAnim,
                        },
                      ]}
                      source={{uri: url}}></Animated.Image>
                  ) : (
                    <Animated.Image
                      style={[
                        styles.animated3,
                        {
                          opacity: fadeAnim,
                        },
                      ]}
                      source={require('../../Images/profilepictureicon.png')}></Animated.Image>
                  )}
                  <TouchableOpacity
                    onPress={onPressTripInfo}
                    style={styles.touchable1}>
                    <Text style={styles.text2}>{'View Trip Info'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('visionBoardScreen', {
                        backgroundPhoto: source(),
                      })
                    }
                    style={styles.touchable2}>
                    <Text style={styles.text2}>{'View Vision Board'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onPressMessageBoard}
                    style={styles.touchable3}>
                    <Text style={styles.text2}>{'View Message Board'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onPressGroupContactInfo}
                    style={[
                      styles.touchable5,
                      {
                        opacity: haveContactsBeenAdded ? 0.5 : 1,
                      },
                    ]}
                    disabled={haveContactsBeenAdded}>
                    <View style={styles.view3}>
                      <Text
                        style={[
                          styles.text20,
                          {
                            opacity: haveContactsBeenAdded ? 0.5 : 1,
                          },
                        ]}>
                        {"Get Your Group's Contact Info"}
                      </Text>
                      {haveContactsBeenAdded && (
                        <Image
                          source={require('../../Images/check2.png')}
                          style={styles.image1}></Image>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.nestedView2}>
                  <View style={styles.view4}>
                    <Image
                      style={styles.image2}
                      source={require('../../Images/homeaddressicon.png')}></Image>
                    <Text style={styles.text3}>
                      {'Address: '}
                      <Text style={styles.text4}>{address}</Text>
                    </Text>
                  </View>
                  <View style={styles.view5}>
                    <Image
                      style={styles.image3}
                      source={require('../../Images/emailaddressicon.png')}></Image>
                    <Text style={styles.text21}>
                      {'Email Address: '}
                      <Text style={styles.text5}>{email}</Text>
                    </Text>
                  </View>
                  <View style={styles.view6}>
                    <Image
                      style={styles.image4}
                      source={require('../../Images/phonenumbericon.png')}></Image>
                    <Text style={styles.text22}>
                      {'Phone number: '}
                      <Text style={styles.text6}>{phoneNumber}</Text>
                    </Text>
                  </View>
                  <View style={styles.view7}>
                    <Image
                      style={styles.image5}
                      source={require('../../Images/appicon.png')}></Image>
                    <Text style={styles.text23}>
                      {'Full name: '}
                      <Text style={styles.text7}>{fullName}</Text>
                    </Text>
                  </View>
                  <View style={styles.view8}>
                    <Text style={styles.text24}>
                      {'Emergency Contact Name: '}
                      <Text style={styles.text8}>{emergencyContact}</Text>
                    </Text>
                  </View>
                  <View style={styles.view18}>
                    <Text style={styles.text25}>
                      {'Emergency Contact Phone: '}
                      <Text style={styles.text9}>{emergencyContactPhone}</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.view10}>
                  <Text style={styles.text26}>
                    {'Bio: '}
                    <Text style={styles.text10}>{bio}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onEditPress}
                  style={styles.touchable6}>
                  <Text style={styles.text11}>{'Edit'}</Text>
                </TouchableOpacity>
              </>
            )}
            {(!dataFlag || newUser) && (
              <>
                <Text style={styles.text12}>
                  {"Let's get some informaton."}
                </Text>
                <View style={styles.view11}>
                  {url === undefined ? (
                    <Animated.Image
                      style={[
                        styles.animated4,
                        {
                          opacity: fadeAnim,
                        },
                      ]}
                      source={
                        !userPhoto
                          ? require('../../Images/profilepictureicon.png')
                          : {uri: userPhoto}
                      }
                    />
                  ) : (
                    <Animated.Image
                      style={[
                        styles.animated5,
                        {
                          opacity: fadeAnim,
                        },
                      ]}
                      source={{uri: userPhoto || url}}
                    />
                  )}
                </View>
                <View style={styles.view12}>
                  <View style={styles.nestedView3}>
                    <Text style={styles.text13}>{'Upload Photo ?'}</Text>
                    <TouchableOpacity onPress={openPicker}>
                      <Animated.Image
                        style={[
                          styles.animated6,
                          {
                            transform: [{translateX}],
                          },
                        ]}
                        source={require('../../Images/camerapictureicon.png')}></Animated.Image>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.nestedView4}>
                    <Text style={styles.text14}>{'Upload NDA?'}</Text>
                    <TouchableOpacity onPress={toggleDocPickerSwitch}>
                      <Animated.Image
                        style={[
                          styles.animated7,
                          {
                            transform: [{translateX}],
                          },
                        ]}
                        source={require('../../Images/ndaicon.png')}></Animated.Image>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.view13}>
                    <TouchableOpacity
                      onPress={onPressChangeBackground}
                      style={styles.touchable4}>
                      <Text style={styles.text1}>
                        {'Change background photo'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.view14}>
                  <Text style={styles.text15}>{'Full Name'}</Text>
                </View>
                <View style={styles.view15}>
                  <TextInput
                    value={fullName}
                    placeholder=" full name"
                    onChangeText={fullName => setFullName(fullName)}
                    secureTextEntry={false}
                    style={styles.textInput1}></TextInput>
                  <View style={styles.view16}>
                    <Text style={styles.text16}>{'Phone Number'}</Text>
                  </View>
                  <TextInput
                    value={phoneNumber}
                    placeholder=" phone number"
                    onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                    secureTextEntry={false}
                    style={styles.textInput2}></TextInput>
                  <View style={styles.view17}>
                    <Text style={styles.text17}>{'Address'}</Text>
                  </View>
                  <TextInput
                    value={address}
                    placeholder=" address"
                    onChangeText={address => setAddress(address)}
                    secureTextEntry={false}
                    style={styles.textInput3}></TextInput>
                  <View style={styles.view19}>
                    <Text style={styles.text18}>
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
                    style={styles.textInput4}></TextInput>
                  <View style={styles.view20}>
                    <Text style={styles.text19}>
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
                    style={styles.textInput5}></TextInput>
                  <View style={styles.view21}>
                    <Text style={styles.text27}>{'Bio'}</Text>
                  </View>
                  <TextInput
                    value={bio}
                    placeholder=" bio"
                    onChangeText={bio => setBio(bio)}
                    secureTextEntry={false}
                    multiline={true}
                    maxLength={2000}
                    style={styles.textInput6}></TextInput>
                </View>
                <View style={styles.nestedView6}>
                  <View
                    style={[
                      showCameraIcon && styles.circleBefore,
                      !showCameraIcon && styles.circleAfter,
                    ]}>
                    {showCameraIcon ? (
                      <Image
                        style={styles.image6}
                        source={require('../../Images/cameraIcon_Hollis.png')}></Image>
                    ) : (
                      !showCameraIcon && (
                        <Image
                          style={styles.image7}
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
                        style={styles.image8}
                        source={require('../../Images/checklistIcon_Hollis.png')}></Image>
                    ) : (
                      !showCheckListIcon && (
                        <Image
                          style={styles.image9}
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
                        style={styles.image10}
                        source={require('../../Images/folderIcon_Hollis.png')}></Image>
                    ) : (
                      !showFolderIcon && (
                        <Image
                          style={styles.image11}
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
                style={styles.touchable7}>
                <Text style={styles.text28}>{'Submit'}</Text>
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
                <Text style={styles.text29}>
                  {'Are you sure you want to make this change? '}
                </Text>
              ) : (
                !docPickerState && (
                  <Text style={styles.text30}>
                    {'Would you like to edit your information?'}
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
                  style={styles.touchable8}>
                  <Text style={styles.text31}>{'Yes'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onPressNo} style={styles.touchable9}>
                <Text style={styles.text32}>
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
          <View style={styles.view22}>
            <TouchableOpacity
              onPress={onPressCloseModal}
              style={styles.touchable10}>
              <Image
                style={styles.image12}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
            {!showTripModal && !modalVisible3 && (
              <>
                <TouchableOpacity
                  style={styles.touchable11}
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
                  style={styles.touchable12}>
                  <Image
                    style={[
                      !secondPhotoPressed && styles.backgroundBefore,
                      secondPhotoPressed && styles.backgroundAfter,
                    ]}
                    source={require('../../Images/backgroundPhoto2.jpeg')}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPressThirdBackgroundPhoto}
                  style={styles.touchable13}>
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
                  style={styles.touchable14}
                  onPress={onPressTripDest}>
                  <Text style={styles.text33}>{"Valle Crucis 24'"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchable15}
                  onPress={onPressTripDest}>
                  <Text style={styles.text34}>{"Cozumel 25'"}</Text>
                </TouchableOpacity>
              </>
            )}
            {modalVisible3 && (
              <>
                <View style={{}}>
                  <Text style={styles.text35}>Valle Crucis 24'</Text>
                  <View style={styles.view23}>
                    <FlatList
                      data={users}
                      renderItem={({item}) => (
                        <View style={styles.flatList}>
                          <View style={styles.view24}>
                            <Text style={styles.text36}>{item.username}</Text>
                          </View>
                          <View>
                            <Text style={styles.text37}>
                              {`Mobile: ${
                                item.phoneNumbers.mobile || ''
                              }\nMain: ${
                                item.phoneNumbers.main || ''
                              }\nHome Fax: ${
                                item.phoneNumbers.homeFax || ''
                              }\nWork: ${item.phoneNumbers.work || ''}\nHome: ${
                                item.phoneNumbers.home || ''
                              }`}
                            </Text>
                          </View>
                        </View>
                      )}
                      keyExtractor={item => item.familyName}
                    />
                  </View>
                </View>
                <View style={styles.view25}>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(users)}
                    style={styles.touchable16}>
                    <Text style={styles.text38}>{'Copy Group Contact'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onPressOpenContacts}
                    style={styles.touchable17}>
                    <Text style={styles.text39}>{'Open Contacts'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
