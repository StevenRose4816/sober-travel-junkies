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
import {get, set, ref} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../../store/user/slice';
import {useAppSelector} from '../../hooks';
import HomeScreenButton from '../../components/HomeScreenButton';
import UserInfoField from '../../components/UserInfoField';
import HomeScreenEditButton from '../../components/HomeScreenEditButton';
import Routes from '../../navigation/routes';
import styles from './styles';
import {
  NavPropAny,
  HomeScreenRouteProp,
  AppStackParams,
} from '../../navigation/types';
import {setSelectedDocument} from '../../store/document/slice';
import {setNewUser} from '../../store/globalStore/slice';
import FastImage from 'react-native-fast-image';

interface IDataFromStorage {
  address: string;
  bio: string;
  email: string;
  emergencyContact: string;
  phoneNumber: string;
  userPhoto: string;
  username: string;
  fullName: string;
}

const Home_Screen: FC = () => {
  const navigation = useNavigation<NavPropAny>();
  const route = useRoute<RouteProp<AppStackParams, Routes.home_Screen>>();
  const dispatch = useDispatch();
  const background1: ImageSourcePropType = require('../../Images/backgroundPhoto1.jpeg');
  const logo: ImageSourcePropType = require('../../Images/STJLogoTransparent.png');
  const homeIcon: ImageSourcePropType = require('../../Images/homeaddressicon.png');
  const emailIcon: ImageSourcePropType = require('../../Images/emailaddressicon.png');
  const phoneIcon: ImageSourcePropType = require('../../Images/phonenumbericon.png');
  const nameIcon: ImageSourcePropType = require('../../Images/appicon.png');
  const userPhotoFromRedux = useAppSelector(state => state.user.userPhoto);
  const userId = auth().currentUser?.uid;
  const [dataFromStorage, setDataFromStorage] = useState<IDataFromStorage>({
    address: '',
    bio: '',
    email: '',
    emergencyContact: '',
    phoneNumber: '',
    userPhoto: '',
    username: '',
    fullName: '',
  });
  const {address, email, phoneNumber, fullName} = dataFromStorage;
  const backgroundSource = route.params?.source || background1;
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (userPhotoFromRedux) {
      setLoad(false);
    }
  }, [userPhotoFromRedux]);

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
    setTimeout(() => dispatch(setUserPhoto({userPhoto: null})), 2000);
    dispatch(setSelectedDocument({selectedDocument: undefined}));
    dispatch(setNewUser({newUser: false}));
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
  const writeToRealTimeDB = async (
    userId: string | undefined,
    formValues: any,
  ) => {
    set(ref(db, 'users/' + userId), {
      fullName: formValues.fullname || '',
      email: formValues.email || '',
      address: formValues.address || '',
      phoneNumber: formValues.phoneNumber || '',
      userPhoto: userPhotoFromRedux || '',
      emergencyContact: formValues.emergencyContact || '',
      emergencyContactPhone: formValues.emergencyContactPhone || '',
      bio: formValues.bio || '',
      backgroundPhoto: source(),
    })
      .then(() => {
        console.log('RTDB updated');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const readDataFromRealTimeDB = async () => {
    if (!userId) return;
    const countRef = ref(db, 'users/' + userId);
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setDataFromStorage(data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading data from the database:', error);
    }
  };

  const source = () => {
    if (userPhotoFromRedux) {
      return {uri: userPhotoFromRedux};
    } else {
      return require('../../Images/profilepictureicon.png');
    }
  };

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          source={backgroundSource}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}>
          <Image style={styles.profilePicture} source={logo} />
          <View style={styles.imageContainer}>
            {load ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FastImage
                style={
                  load
                    ? styles.userImageWithOutBorder
                    : styles.userImageWithBorder
                }
                source={source()}
              />
            )}
          </View>
          <HomeScreenButton
            onPress={() =>
              navigation.navigate(Routes.calenderScreen, {
                backgroundPhoto: backgroundSource,
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
                backgroundPhoto: backgroundSource,
              })
            }
            title={'Message Board'}
          />
          <View style={styles.dividerView} />
          <UserInfoField
            label={'Mailing Address'}
            uri={homeIcon}
            value={address}
          />
          <UserInfoField
            label={'Email Address'}
            uri={emailIcon}
            value={email}
          />
          <UserInfoField
            label={'Phone Number'}
            uri={phoneIcon}
            value={phoneNumber}
          />
          <UserInfoField label={'Full Name'} uri={nameIcon} value={fullName} />
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
