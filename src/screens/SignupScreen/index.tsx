import {FC, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Modal} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {IUserInfo, setUserInfo} from '../../store/globalStore/slice';
import {useAppSelector} from '../../hooks';
import styles from './styles';

const SignupScreen: FC = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [address, setAddress] = useState('');
  const userInfo = useAppSelector(state => state.globalStore);
  const [emailPasswordError, setEmailPasswordError] = useState('');

  const mapUser = () => {
    if (!!userInfo) {
      const mappedUserInfo: IUserInfo = {
        phoneNumber: phoneNumber,
        address: address,
        name: name,
      };
      dispatch(setUserInfo(mappedUserInfo));
    } else {
      console.log('no userInfo');
    }
  };

  const signUp = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      mapUser();
    } catch (e: any) {
      console.log(e);
      setErrorMessage(e);
      setModalVisible(!modalVisible);
    }
  };

  const checkEmail = (email: string) => {
    if (email.length <= 12 && password.length <= 6) {
      setEmailPasswordError(
        'Your email address needs to be at least 12 characters and your password need to be at least 6 characters.',
      );
      setModalVisible(!modalVisible);
    } else if (email.length >= 12 && password.length <= 6) {
      setEmailPasswordError('Your password needs to be at least 6 characters.');
      setModalVisible(!modalVisible);
    } else if (password.length >= 6 && email.length <= 12) {
      setEmailPasswordError(
        'Your email address needs to be at least 12 characters.',
      );
      setModalVisible(!modalVisible);
    } else {
      signUp();
    }
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.innerContainerView}>
        <Text style={styles.emailText}>{'email'}</Text>
        <TextInput
          style={styles.emailInput}
          autoCapitalize={'none'}
          value={email}
          onChangeText={val => setEmail(val)}
          secureTextEntry={false}
        />
        <Text style={styles.passwordText}>{'password'}</Text>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={val => setPassword(val)}
          secureTextEntry={true}
        />
        <View style={styles.touchableContainer}>
          <TouchableOpacity
            onPress={() => checkEmail(email)}
            style={styles.signupTouchable}>
            <Text style={styles.signupText}>{'Sign Up'}</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType={'slide'}
            transparent={true}
            onRequestClose={() => setModalVisible(!modalVisible)}>
            <View style={styles.modalContainer}>
              <View style={styles.innerModalContainer}>
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : (
                  <Text style={styles.emailErrorText}>
                    {emailPasswordError}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.closeTouchable}>
                  <Text style={styles.closeText}>{'Close'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;
