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
    justifyContent: 'center',
    borderRadius: 5,
    padding: 20,
  },
  closeTouchable: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    height: 25,
    width: 25,
  },
  docPickerContainer: {
    flex: 1,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
  },
});

export default styles;
