import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    backgroundColor: '#eee7da',
    borderRadius: 5,
    maxHeight: 60,
    width: screenWidth * 0.9,
  },
  labelText: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 20,
    fontFamily: 'Vonique64',
  },
  animatedStyle: {
    height: 50,
    width: 50,
    borderRadius: 5,
    marginRight: 20,
  },
});

export default styles;
