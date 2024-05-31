import React, {FC, useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import styles from './styles';
import HomeScreenButton from '../../components/HomeScreenButton';
import UserInfoField from '../../components/UserInfoField';
import {getDownloadURL, getStorage, ref as storageRef} from 'firebase/storage';
import auth from '@react-native-firebase/auth';
import {get, ref} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../../store/user/slice';
import {useAppSelector} from '../../hooks';
import HomeScreenEditButton from '../../components/HomeScreenEditButton';
import {useNavigation} from '@react-navigation/native';
import {NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import DocumentPickerModal from '../../components/HomeScreenButton/DocumentPickerModal';

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
  const [firstPhotoPressed, setFirstPhotoPressed] = useState(false);
  const [secondPhotoPressed, setSecondPhotoPressed] = useState(false);
  const [thirdPhotoPressed, setThirdPhotoPressed] = useState(false);
  const [fourthPhotoPressed, setFourthPhotoPressed] = useState(false);
  const {address, email, phoneNumber, fullName} = dataFromStorage;

  const source = () => {
    if (firstPhotoPressed) {
      return require('../../Images/backgroundPhoto1.jpeg');
    } else if (secondPhotoPressed) {
      return require('../../Images/backgroundPhoto2.jpeg');
    } else if (thirdPhotoPressed) {
      return require('../../Images/backgroundPhoto3.jpeg');
    } else if (fourthPhotoPressed) {
      return require('../../Images/backgroundPhoto4.jpeg');
    } else {
      return require('../../Images/backgroundPhoto1.jpeg');
    }
  };

  useEffect(() => {
    readDataFromRealTimeDB();
    if (userId && !userPhotoFromRedux) {
      getProfilePicFromStorage(userId + '_profilePic');
    }
  }, [userId, dataFromStorage]);

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

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          source={background1}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}>
          <Image style={styles.profilePicture} source={logo} />
          <Image
            style={styles.userImage}
            source={
              userPhotoFromRedux
                ? {uri: userPhotoFromRedux}
                : require('../../Images/profilepictureicon.png')
            }
          />
          <HomeScreenButton
            onPress={() => navigation.navigate(Routes.booneScreen)}
            title={'View Trip Info'}
          />
          <HomeScreenButton
            onPress={() => navigation.navigate(Routes.visionBoardScreen)}
            title={'View Vision Board'}
          />
          <HomeScreenButton
            onPress={() => console.log('pressed')}
            title={'View Message Board'}
          />
          <View style={styles.dividerView} />
          <UserInfoField label={'Address'} uri={homeIcon} value={address} />
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
