import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: '#e7b6cc',
    borderRadius: 5,
    marginLeft: screenWidth * 0.72,
    marginBottom: 20,
    width: 100,
    borderWidth: 1,
    borderColor: '#eee7da',
  },
  editText: {
    color: '#0c0b09',
    fontSize: 12,
    fontWeight: '600',
    margin: 10,
    textAlign: 'center',
    fontFamily: 'HighTide-Sans',
  },
});

export default styles;
