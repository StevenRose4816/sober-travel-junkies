import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    maxHeight: 50,
    width: screenWidth * 0.9,
    flexDirection: 'row',
    backgroundColor: '#b6e7cc',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#eee7da',
  },
  homeIcon: {
    width: 40,
    height: 40,
    margin: 10,
    alignSelf: 'center',
  },
  labelText: {
    fontFamily: 'HighTide-Sans',
    alignSelf: 'center',
  },
  valueText: {
    fontFamily: 'Vonique64',
  },
});

export default styles;
