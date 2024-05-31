import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerView: {
    flex: 1,
  },
  profilePicture: {
    marginTop: 20,
    height: 150,
    width: screenWidth * 0.9,
  },
});

export default styles;
