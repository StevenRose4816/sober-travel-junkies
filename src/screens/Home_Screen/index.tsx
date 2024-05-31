import React, {FC, useEffect, useState} from 'react';
import {ImageBackground, ScrollView, View, Image} from 'react-native';
import styles from './styles';
import HomeScreenButton from '../../components/HomeScreenButton';
import UserInfoField from '../../components/UserInfoField';
import {getDownloadURL, getStorage, ref as thisRef} from 'firebase/storage';
import auth from '@react-native-firebase/auth';
import {get, onValue, ref, set} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';

const Home_Screen: FC = () => {
  const background1 = require('../../Images/backgroundPhoto1.jpeg');
  const placeHolderAddressValue = '123 Address';
  const logo = require('../../Images/STJLogoTransparent.png');
  const homeIcon = require('../../Images/homeaddressicon.png');
  const emailIcon = require('../../Images/emailaddressicon.png');
  const phoneIcon = require('../../Images/phonenumbericon.png');
  const nameIcon = require('../../Images/appicon.png');
  const userId = auth().currentUser?.uid;
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [dataFromStorage, setDataFromStorage] = useState();

  useEffect(() => {
    readDataFromRealTimeDB();
    getProfilePicFromStorage(userId + '_profilePic');
  }, []);

  useEffect(() => {
    console.log('userPhoto: ', userPhoto);
    console.log('dataFromStorage: ', dataFromStorage);
  }, [userPhoto, dataFromStorage]);

  const getProfilePicFromStorage = async (imageName: string) => {
    const storage = getStorage();
    const reference = thisRef(storage, imageName);
    try {
      await getDownloadURL(reference).then(url => {
        setUserPhoto(url);
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const readDataFromRealTimeDB = async () => {
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
              {uri: userPhoto} || require('../../Images/profilepictureicon.png')
            }
          />
          <HomeScreenButton
            onPress={() => console.log('pressed')}
            title={'View Trip Info'}
          />
          <HomeScreenButton
            onPress={() => console.log('pressed')}
            title={'View Vision Board'}
          />
          <HomeScreenButton
            onPress={() => console.log('pressed')}
            title={'View Message Board'}
          />
          <View style={styles.dividerView} />
          <UserInfoField
            label={'Address'}
            uri={homeIcon}
            value={placeHolderAddressValue}
          />
          <UserInfoField
            label={'Email Address'}
            uri={emailIcon}
            value={placeHolderAddressValue}
          />
          <UserInfoField
            label={'Phone Number'}
            uri={phoneIcon}
            value={placeHolderAddressValue}
          />
          <UserInfoField
            label={'Full Name'}
            uri={nameIcon}
            value={placeHolderAddressValue}
          />
          <View style={styles.dividerView} />
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default Home_Screen;
