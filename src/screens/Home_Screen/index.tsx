import {FC, useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {getDownloadURL, getStorage, ref as storageRef} from 'firebase/storage';
import {get, set, ref, startAfter, update} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';
import {useDispatch} from 'react-redux';
import {
  setUserPhoto,
  setDataFromStorage as setDataFromStorageAlias,
  setBackgroundPhoto,
} from '../../store/user/slice';
import {useAppSelector} from '../../hooks';
import HomeScreenButton from '../../components/HomeScreenButton';
import UserInfoField from '../../components/UserInfoField';
import HomeScreenEditButton from '../../components/HomeScreenEditButton';
import Routes from '../../navigation/routes';
import styles from './styles';
import {NavPropAny} from '../../navigation/types';
import FastImage from 'react-native-fast-image';

interface IDataFromStorage {
  address: string;
  email: string;
  phoneNumber: string;
  userPhoto: string;
  fullName: string;
  backgroundphoto: string;
}

const Home_Screen: FC = () => {
  const navigation = useNavigation<NavPropAny>();
  const dispatch = useDispatch();
  const logo: ImageSourcePropType = require('../../Images/STJLogoTransparent.png');
  const homeIcon: ImageSourcePropType = require('../../Images/homeaddressicon.png');
  const emailIcon: ImageSourcePropType = require('../../Images/emailaddressicon.png');
  const phoneIcon: ImageSourcePropType = require('../../Images/phonenumbericon.png');
  const nameIcon: ImageSourcePropType = require('../../Images/appicon.png');
  const userPhotoFromRedux = useAppSelector(state => state.user.userPhoto);
  const backgroudPhoto = useAppSelector(
    state => state.user.dataFromStorage?.backgroudPhoto,
  );
  const userId = auth().currentUser?.uid;
  const [dataFromStorage, setDataFromStorage] = useState<IDataFromStorage>({
    address: '',
    email: '',
    phoneNumber: '',
    userPhoto: '',
    fullName: '',
    backgroundphoto: '',
  });
  const {address, email, phoneNumber, fullName, backgroundphoto} =
    dataFromStorage;
  const [load, setLoad] = useState(true);
  const phoneNewUser = useAppSelector(state => state.user.phoneNumber);
  const addressNewUser = useAppSelector(state => state.user.mailingAddress);
  const emailNewUser = useAppSelector(state => state.user.email);
  const fullNameNewUser = useAppSelector(state => state.user.fullName);
  const newUser = useAppSelector(state => state.globalStore.newUser);
  const dataFromStorageRedux = useAppSelector(
    state => state.user.dataFromStorage,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (userPhotoFromRedux || newUser) {
      // we need to force a user to select a userphoto before signing out otherwise it will load forever
      setLoad(false);
      if (
        newUser &&
        fullNameNewUser &&
        emailNewUser &&
        phoneNewUser &&
        addressNewUser
      ) {
        writeToRealTimeDB(userId);
        setTimeout(() => readDataFromRealTimeDB(), 1000);
      }
    }
  }, [
    newUser,
    fullNameNewUser,
    emailNewUser,
    phoneNewUser,
    addressNewUser,
    userPhotoFromRedux,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={styles.logoutTouchable}>
          <Text style={styles.logoutText}>{'Log out'}</Text>
        </TouchableOpacity>
      ),
    });
    readDataFromRealTimeDB();
    if (userId && !userPhotoFromRedux) {
      getProfilePicFromStorage(userId + '_profilePic');
    }
  }, [dataFromStorageRedux]);

  const logout = () => {
    if (
      !userPhotoFromRedux ||
      userPhotoFromRedux.trim() === '' ||
      !dataFromStorage.userPhoto ||
      dataFromStorage.userPhoto.trim() === ''
    ) {
      setIsVisible(true);
    } else {
      auth().signOut();
      setTimeout(() => dispatch(setUserPhoto({userPhoto: null})), 1000);
      dispatch({type: 'LOGOUT'});
    }
  };

  const getProfilePicFromStorage = async (imageName: string) => {
    const storage = getStorage();
    const reference = storageRef(storage, imageName);
    try {
      const firebaseUrl = await getDownloadURL(reference);
      dispatch(setUserPhoto({userPhoto: firebaseUrl}));
    } catch (e: any) {
      // console.log(e.message);
    }
  };

  const readFromStorage = async (imageName: string) => {
    const storage = getStorage();
    const reference = storageRef(storage, imageName);
    try {
      await getDownloadURL(reference).then(url => {
        setUrl(url);
        dispatch(setUserPhoto({userPhoto: url}));
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const writeToRealTimeDB = async (userId: string | undefined) => {
    if (!userPhotoFromRedux) {
      set(ref(db, 'users/' + userId), {
        fullName: fullNameNewUser,
        email: emailNewUser,
        address: addressNewUser,
        phoneNumber: phoneNewUser,
        backgroundphoto: '1',
        // below is wrong, need to upload default image to storage and then just pull the URL and set it as the userphoto here
        // userPhoto: require('../../Images/profilepictureicon.png'),
      })
        .then(() => {
          console.log('RTDB updated');
        })
        .catch(error => {
          // console.log(error);
        });
    } else {
      set(ref(db, 'users/' + userId), {
        fullName: fullNameNewUser,
        email: emailNewUser,
        address: addressNewUser,
        phoneNumber: phoneNewUser,
        userPhoto:
          userPhotoFromRedux || require('../../Images/profilepictureicon.png'),
        backgroundphoto: backgroudPhoto ?? '1',
      })
        .then(() => {
          console.log('RTDB updated');
        })
        .catch(error => {
          // console.log(error);
        });
    }
  };

  const backgroundsource = () => {
    switch (dataFromStorage?.backgroundphoto) {
      case '1':
        return require('../../Images/backgroundPhoto1.jpeg');
      case '2':
        return require('../../Images/backgroundPhoto2.jpeg');
      case '3':
        return require('../../Images/backgroundPhoto3.jpeg');
      case '4':
        return require('../../Images/backgroundPhoto4.jpeg');
      default:
        return require('../../Images/backgroundPhoto1.jpeg');
    }
  };

  const source = () => {
    if (userPhotoFromRedux && userPhotoFromRedux.trim() !== '') {
      return {uri: userPhotoFromRedux};
    } else {
      return require('../../Images/profilepictureicon.png');
    }
  };

  const readDataFromRealTimeDB = async () => {
    if (!userId) return;
    const countRef = ref(db, 'users/' + userId);
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setDataFromStorage(data);
        dispatch(setDataFromStorageAlias({dataFromStorage}));
      } else {
        // console.log('No data available');
      }
    } catch (error) {
      // console.error('Error reading data from the database:', error);
    }
  };

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          source={backgroundsource()}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}>
          <Image style={styles.profilePicture} source={logo} />
          <View style={styles.imageContainer}>
            {load ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FastImage
                style={
                  load || newUser
                    ? styles.userImageWithOutBorder
                    : styles.userImageWithBorder
                }
                source={source()}
              />
            )}
          </View>
          {newUser && !userPhotoFromRedux && (
            <HomeScreenButton
              title="Select Profile Photo"
              onPress={() => navigation.navigate(Routes.imagePicker)}
              overRiddenWidth={0.5}
            />
          )}
          <HomeScreenButton
            onPress={() =>
              navigation.navigate(Routes.calenderScreen, {
                backgroundPhoto: backgroundphoto,
              })
            }
            title={'Events'}
          />
          <HomeScreenButton
            onPress={() => navigation.navigate(Routes.visionBoardScreen)}
            title={'Vision Board'}
          />
          <HomeScreenButton
            onPress={() =>
              navigation.navigate(Routes.messageBoardScreen, {
                fullName: fullName,
                backgroundPhoto: backgroundphoto,
              })
            }
            title={'Message Board'}
          />
          <View style={styles.dividerView} />
          <UserInfoField
            label={'Mailing Address'}
            uri={homeIcon}
            value={address || addressNewUser!}
          />
          <UserInfoField
            label={'Email Address'}
            uri={emailIcon}
            value={email || emailNewUser!}
          />
          <UserInfoField
            label={'Phone Number'}
            uri={phoneIcon}
            value={phoneNumber || phoneNewUser!}
          />
          <UserInfoField
            label={'Full Name'}
            uri={nameIcon}
            value={fullName || fullNameNewUser!}
          />
          <View style={styles.dividerView} />
          <HomeScreenEditButton
            onPress={() => navigation.navigate(Routes.editUserInfoScreen)}
          />
        </ImageBackground>
      </ScrollView>
      <Modal
        visible={isVisible}
        animationType={'slide'}
        transparent={true}
        onRequestClose={() => setIsVisible(false)}>
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
              backgroundColor: '#b6e7cc',
              minHeight: 300,
              width: '80%',
              borderRadius: 5,
              padding: 20,
            }}>
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
              }}>
              <Image
                style={{
                  height: 25,
                  width: 25,
                }}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>

            <Text
              style={{
                textAlign: 'center',
                marginVertical: 20,
                marginBottom: 70,
              }}>
              Please select a profile photo before logging out.
            </Text>

            <View style={{alignItems: 'center'}}>
              <HomeScreenButton
                overRiddenWidth={0.7}
                title="Select Photo From Library"
                onPress={() => {
                  setIsVisible(false);
                  navigation.navigate(Routes.imagePicker);
                }}
              />
              <HomeScreenButton
                overRiddenWidth={0.7}
                title="Select Default Photo"
                onPress={() => {
                  readFromStorage('profilepictureicon.png');
                  setIsVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home_Screen;
