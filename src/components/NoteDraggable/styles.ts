import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  imageBackground: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'HighTide-Sans',
  },
  closeTouchable: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    height: 25,
    width: 25,
    marginBottom: 5,
  },
});

export default styles;
