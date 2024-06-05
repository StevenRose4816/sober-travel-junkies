import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 15,
    right: 15,
  },
  imageTouchable: {
    backgroundColor: '#e7b6cc',
    borderRadius: 5,
    width: 100,
    borderWidth: 1,
    borderColor: '#eee7da',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableText: {
    color: '#0c0b09',
    textAlign: 'center',
    fontFamily: 'HighTide-Sans',
  },
  touchableUpdate: {
    backgroundColor: '#e7b6cc',
    borderRadius: 50,
    width: 80,
    height: 80,
    margin: 20,
    borderWidth: 1,
    borderColor: '#eee7da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateText: {
    color: '#0c0b09',
    fontFamily: 'HighTide-Sans',
    textAlign: 'center',
  },
  noteTouchable: {
    backgroundColor: '#e7b6cc',
    borderRadius: 5,
    width: 100,
    borderWidth: 1,
    borderColor: '#eee7da',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    color: '#0c0b09',
    fontFamily: 'HighTide-Sans',
    textAlign: 'center',
  },
});

export default styles;
