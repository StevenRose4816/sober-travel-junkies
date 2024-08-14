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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {getDownloadURL, getStorage, ref as storageRef} from 'firebase/storage';
import {get, set, ref, update} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';
import {useDispatch} from 'react-redux';
import {setBackgroundPhoto, setUserPhoto} from '../../store/user/slice';
import {useAppSelector} from '../../hooks';
import HomeScreenButton from '../../components/HomeScreenButton';
import UserInfoField from '../../components/UserInfoField';
import HomeScreenEditButton from '../../components/HomeScreenEditButton';
import Routes from '../../navigation/routes';
import styles from './styles';
import {NavPropAny, AppStackParams} from '../../navigation/types';
import FastImage from 'react-native-fast-image';
import Email from '../Email';

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

  useEffect(() => {
    if (!!dataFromStorage) {
      setLoad(false);
    }
  }, [dataFromStorage]);

  useEffect(() => {
    if (userPhotoFromRedux || newUser) {
      if (
        newUser &&
        fullNameNewUser &&
        emailNewUser &&
        phoneNewUser &&
        addressNewUser
      ) {
        writeToRealTimeDB(userId);
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
  }, [dataFromStorage]);

  const logout = () => {
    auth().signOut();
    setTimeout(() => dispatch(setUserPhoto({userPhoto: null})), 1000);
    dispatch({type: 'LOGOUT'});
  };

  const getProfilePicFromStorage = async (imageName: string) => {
    const storage = getStorage();
    const reference = storageRef(storage, imageName);
    try {
      const url = await getDownloadURL(reference);
      dispatch(setUserPhoto({userPhoto: url}));
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const writeToRealTimeDB = async (userId: string | undefined) => {
    set(ref(db, 'users/' + userId), {
      fullName: fullNameNewUser,
      email: emailNewUser,
      address: addressNewUser,
      phoneNumber: phoneNewUser,
    })
      .then(() => {
        console.log('RTDB updated');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const backgroundsource = () => {
    if (dataFromStorage.backgroundphoto === '1') {
      return require('../../Images/backgroundPhoto1.jpeg');
    } else if (dataFromStorage.backgroundphoto === '2') {
      return require('../../Images/backgroundPhoto2.jpeg');
    } else if (dataFromStorage.backgroundphoto === '3') {
      return require('../../Images/backgroundPhoto3.jpeg');
    } else if (dataFromStorage.backgroundphoto === '4') {
      return require('../../Images/backgroundPhoto4.jpeg');
    } else {
      return require('../../Images/backgroundPhoto1.jpeg');
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
        // need to dispatch this data to redux, so we can use it elsewhere and no longer need to readfromDB on edit screen.
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading data from the database:', error);
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
            ) : userPhotoFromRedux?.trim() !== '' ? (
              <FastImage
                style={styles.userImageWithBorder}
                source={{uri: userPhotoFromRedux}}
              />
            ) : (
              <Image
                style={styles.userImageWithOutBorder}
                source={require('../../Images/profilepictureicon.png')}
              />
            )}
          </View>
          {newUser && (
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
    </View>
  );
};

export default Home_Screen;
