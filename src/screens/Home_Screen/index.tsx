import React, {FC} from 'react';
import {
  ImageBackground,
  ScrollView,
  View,
  Image,
  Dimensions,
} from 'react-native';
import styles from './styles';
import HomeScreenButton from '../../components/HomeScreenButton';
import UserInfoField from '../../components/UserInfoField';

const Home_Screen: FC = () => {
  const background1 = require('../../Images/backgroundPhoto1.jpeg');
  const placeHolderUserImage = require('../../Images/profile-picture-vector.jpeg');
  const placeHolderAddressValue = '123 Address';
  const logo = require('../../Images/STJLogoTransparent.png');
  const homeIcon = require('../../Images/homeaddressicon.png');
  const emailIcon = require('../../Images/emailaddressicon.png');
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <ImageBackground
          source={background1}
          style={styles.imageBackground}
          imageStyle={{opacity: 0.3}}>
          <Image style={styles.profilePicture} source={logo} />
          <Image style={{marginBottom: 10}} source={placeHolderUserImage} />
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
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default Home_Screen;
