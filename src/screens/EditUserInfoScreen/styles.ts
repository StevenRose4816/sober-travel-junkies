import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
  },
  imageStyle: {
    opacity: 0.3,
  },
  logoImage: {
    marginTop: 20,
    height: 150,
    width: screenWidth * 0.9,
  },
});

export default styles;
