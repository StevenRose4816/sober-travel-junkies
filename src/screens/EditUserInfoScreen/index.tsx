import {FC, useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  View,
} from 'react-native';
import styles from './styles';
import UploadField from '../../components/UploadField';

const EditUserInfoScreen: FC = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cameraIcon: ImageSourcePropType = require('../../Images/camerapictureicon.png');
  const ndaIcon: ImageSourcePropType = require('../../Images/ndaicon.png');
  const logo: ImageSourcePropType = require('../../Images/STJLogoTransparent.png');
  const background1: ImageSourcePropType = require('../../Images/backgroundPhoto1.jpeg');

  useEffect(() => {
    moveImage();
  }, []);

  const moveImage = () => {
    Animated.timing(translateX, {
      toValue: screenWidth * 0.33,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          source={background1}>
          <Image style={styles.logoImage} source={logo}></Image>
          <UploadField
            source={cameraIcon}
            label={'Upload Photo?'}
            translateX={translateX}
          />
          <UploadField
            source={ndaIcon}
            label={'Upload NDA?'}
            translateX={translateX}
            marginLeft={19}
          />
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default EditUserInfoScreen;
