import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  innerContainerView: {
    flex: 1,
    backgroundColor: 'white',
  },
  emailText: {
    marginLeft: 10,
    marginTop: 10,
  },
  emailInput: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 5,
    minHeight: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  passwordText: {
    marginLeft: 10,
    marginTop: 10,
  },
  passwordInput: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 5,
    minHeight: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  touchableContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: 10,
    backgroundColor: 'white',
  },
  signupTouchable: {
    backgroundColor: 'blue',
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 30,
  },
  signupText: {
    color: 'white',
    fontSize: 21,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerModalContainer: {
    backgroundColor: '#b6e7cc',
    minHeight: 300,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#0c0b09',
    marginBottom: 10,
  },
  emailErrorText: {
    textAlign: 'center',
    color: '#0c0b09',
    marginBottom: 10,
  },
  closeTouchable: {
    marginTop: 20,
    backgroundColor: 'blue',
    minHeight: 50,
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  closeText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 21,
    fontWeight: '600',
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default styles;
