import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
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
});

export default styles;
