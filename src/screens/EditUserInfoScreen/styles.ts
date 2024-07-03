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
  userPhotoWithBorder: {
    height: 250,
    width: screenWidth * 0.7,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#eee7da',
    borderWidth: 2,
  },
  userPhotoWithOutBorder: {
    height: 250,
    width: screenWidth * 0.7,
    borderRadius: 5,
    marginBottom: 10,
  },
  textInput: {
    fontFamily: 'HighTide-Sans',
    backgroundColor: '#eee7da',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 5,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#5A6472',
    borderBottomWidth: 3,
    width: screenWidth * 0.9,
  },
  submitTouchable: {
    backgroundColor: '#e7b6cc',
    minHeight: 50,
    width: screenWidth * 0.7,
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#eee7da',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  submitText: {
    color: '#0c0b09',
    fontSize: 21,
    textAlign: 'center',
    fontFamily: 'HighTide-Sans',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
