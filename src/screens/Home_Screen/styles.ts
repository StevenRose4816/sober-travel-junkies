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
  imageStyle: {
    opacity: 0.3,
  },
  containerView: {
    flex: 1,
  },
  profilePicture: {
    marginTop: 20,
    height: 150,
    width: screenWidth * 0.9,
  },
  scrollView: {
    flexGrow: 1,
  },
  userImage: {
    height: 250,
    width: screenWidth * 0.7,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#eee7da',
    borderWidth: 2,
  },
  dividerView: {
    height: 10,
  },
  logoutTouchable: {
    backgroundColor: '#b6e7cc',
    borderRadius: 5,
    width: 65,
    borderWidth: 2,
    borderColor: '#eee7da',
  },
  logoutText: {
    color: '#0c0b09',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12,
    fontFamily: 'HighTide-Sans',
  },
});

export default styles;
