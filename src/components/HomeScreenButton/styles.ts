import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: '#b6e7cc',
    marginTop: 10,
    width: screenWidth * 0.8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#eee7da',
  },
  touchableText: {
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'HighTide-Sans',
  },
});

export default styles;
