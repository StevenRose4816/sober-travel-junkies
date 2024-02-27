import {FC, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Modal} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {IUserInfo, setUserInfo} from '../../store/globalStore/slice';
import {useAppSelector} from '../../hooks';

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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const mapUser = () => {
    // Captures textInput for phoneNumber and address to access in global state.
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
      toggleModal();
    }
  };

  const checkEmail = (email: string) => {
    if (email.length <= 12 && password.length <= 6) {
      setEmailPasswordError(
        'Your email address needs to be at least 12 characters and your password need to be at least 6 characters.',
      );
      toggleModal();
    } else if (email.length >= 12 && password.length <= 6) {
      setEmailPasswordError('Your password needs to be at least 6 characters.');
      toggleModal();
    } else if (password.length >= 6 && email.length <= 12) {
      setEmailPasswordError(
        'Your email address needs to be at least 12 characters.',
      );
      toggleModal();
    } else {
      signUp();
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Text style={{marginLeft: 10, marginTop: 10}}>{'email'}</Text>
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            borderRadius: 5,
            minHeight: 50,
            borderWidth: 1,
            borderColor: 'black',
          }}
          autoCapitalize={'none'}
          value={email}
          onChangeText={setEmail}
          secureTextEntry={false}
        />
        <Text style={{marginLeft: 10, marginTop: 10}}>{'password'}</Text>
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            borderRadius: 5,
            minHeight: 50,
            borderWidth: 1,
            borderColor: 'black',
          }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-end',
            marginBottom: 10,
            backgroundColor: 'white',
          }}>
          <TouchableOpacity
            onPress={() => checkEmail(email)}
            style={{
              backgroundColor: 'blue',
              minHeight: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginHorizontal: 10,
              marginTop: 30,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 21,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'Sign Up'}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType={'slide'}
            transparent={true}
            onRequestClose={toggleModal}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: '#b6e7cc',
                  minHeight: 300,
                  width: '80%',
                  justifyContent: 'center',
                  borderRadius: 5,
                  padding: 20,
                }}>
                {errorMessage ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#0c0b09',
                      marginBottom: 10,
                    }}>
                    {errorMessage}
                  </Text>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#0c0b09',
                      marginBottom: 10,
                    }}>
                    {emailPasswordError}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    marginTop: 20,
                    backgroundColor: 'blue',
                    minHeight: 50,
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 21,
                      fontWeight: '600',
                      backgroundColor: 'blue',
                      borderRadius: 5,
                    }}>
                    {'Close'}
                  </Text>
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
