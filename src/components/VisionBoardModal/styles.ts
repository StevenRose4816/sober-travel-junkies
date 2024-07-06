import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  firstInnerView: {
    backgroundColor: '#b6e7cc',
    minHeight: 300,
    width: '80%',
    borderRadius: 5,
    padding: 20,
    marginTop: screenHeight * 0.2,
  },
  closeTouchable: {
    alignSelf: 'flex-end',
  },
  closeImage: {
    height: 25,
    width: 25,
  },
  touchableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    color: '#0c0b09',
    fontSize: 12,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    fontFamily: 'Vonique64',
  },
  noteInput: {
    fontFamily: 'HighTide-Sans',
    backgroundColor: '#eee7da',
    borderRadius: 5,
    height: 50,
    width: 150,
    borderWidth: 1,
    borderColor: '#5A6472',
    borderBottomWidth: 3,
    marginTop: 40,
    textAlign: 'center',
  },
  updateText: {
    color: '#0c0b09',
    fontSize: 12,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 40,
    fontFamily: 'Vonique64',
  },
  welcomeText: {
    marginTop: 20,
    color: '#0c0b09',
    fontFamily: 'HighTide-Sans',
    textAlign: 'center',
    fontSize: 20,
  },
  modalText: {
    marginTop: 40,
    color: '#0c0b09',
    fontFamily: 'HighTide-Sans',
    textAlign: 'center',
    maxWidth: '90%',
  },
  variableInput: {
    backgroundColor: '#e7b6cc',
    borderRadius: 5,
    width: 100,
    borderWidth: 1,
    borderColor: '#eee7da',
    marginTop: 80,
  },
  variableText: {
    color: '#0c0b09',
    fontSize: 12,
    fontWeight: '600',
    margin: 10,
    textAlign: 'center',
    fontFamily: 'HighTide-Sans',
  },
});

export default styles;
