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

const Home_Screen: FC = () => {
  const background1 = require('../../Images/backgroundPhoto1.jpeg');
  const placeHolderUserImage = require('../../Images/profile-picture-vector.jpeg');
  const logo = require('../../Images/STJLogoTransparent.png');

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <ImageBackground
          source={background1}
          style={styles.imageBackground}
          imageStyle={{opacity: 0.3}}>
          <Image style={styles.profilePicture} source={logo}></Image>
          <Image source={placeHolderUserImage}></Image>
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
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default Home_Screen;
