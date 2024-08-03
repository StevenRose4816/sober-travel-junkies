import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    borderColor: '#0c0b09',
    backgroundColor: '#b6e7cc',
    minHeight: 300,
    width: '80%',
    borderRadius: 5,
    padding: 20,
  },
  closeTouchable: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  closeIcon: {
    height: 25,
    width: 25,
  },
  imageGrid: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  image: {
    height: 100,
    width: 100,
    marginVertical: 10,
  },
});

export default styles;
