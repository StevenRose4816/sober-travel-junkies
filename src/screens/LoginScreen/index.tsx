import {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../../hooks';
import {
  IUserInfo,
  setNewUser,
  setUserInfo,
} from '../../store/globalStore/slice';
import {useDispatch} from 'react-redux';

const LoginScreen: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const user = auth().currentUser;
  const userInfo = useAppSelector(state => state.globalStore);
  const screenWidth = Dimensions.get('window').width;

  const toggleErrorModal = () => {
    setErrorModalVisible(errorModalVisible => !errorModalVisible);
  };

  const toggleSignupModal = () => {
    setSignupModalVisible(signupModalVisible => !signupModalVisible);
  };

  const [passwordCreate, setPasswordCreate] = useState('');
  const [emailCreate, setEmailCreate] = useState('');

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      setErrorMessage(e.message);
      console.log(errorMessage);
      toggleErrorModal();
    }
  };

  const onPressCreateAccount = () => {
    toggleSignupModal();
    setEmailCreate('');
    setPasswordCreate('');
  };

  const signUp = async () => {
    toggleSignupModal();
    try {
      await auth().createUserWithEmailAndPassword(emailCreate, passwordCreate);
      dispatch(setNewUser({newUser: true}));
    } catch (e: any) {
      toggleErrorModal();
      setErrorMessage(e.message);
      console.log(e);
      setErrorModalVisible(true);
      setErrorMessage(e.message);
    }
  };

  const closeErrorModal = () => {
    setErrorMessage(undefined);
    setPasswordCreate('');
    setEmailCreate('');
    toggleErrorModal();
  };

  const closeSignupModal = () => {
    setPasswordCreate('');
    setEmailCreate('');
    toggleSignupModal();
  };

  return (
    <ImageBackground
      source={require('../../Images/STJLogin.jpeg')}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('../../Images/STJ.png')}
        style={{height: 275, width: 275, marginTop: 50}}></Image>
      <TextInput
        style={{
          backgroundColor: '#0c0b09',
          color: '#eee7da',
          width: 175,
          marginHorizontal: 10,
          borderRadius: 10,
          minHeight: 40,
          borderWidth: 1,
          borderColor: 'black',
          textAlign: 'center',
          fontFamily: 'Vonique64',
        }}
        placeholder=" email"
        placeholderTextColor={'#eee7da'}
        autoCapitalize={'none'}
        value={email}
        onChangeText={email => setEmail(email)}
      />
      <TextInput
        style={{
          textAlign: 'center',
          width: 175,
          backgroundColor: '#0c0b09',
          color: '#eee7da',
          marginHorizontal: 10,
          marginBottom: 10,
          marginTop: 5,
          borderRadius: 10,
          minHeight: 40,
          borderWidth: 1,
          borderColor: 'black',
          fontFamily: 'Vonique64',
        }}
        placeholder=" password"
        placeholderTextColor={'#eee7da'}
        value={password}
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={login}
        style={{
          backgroundColor: '#b6e7cc',
          minHeight: 35,
          width: screenWidth * 0.3,
          justifyContent: 'center',
          borderRadius: 10,
          marginHorizontal: 10,
          marginTop: 10,
          marginBottom: 10,
        }}>
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 14,
            textAlign: 'center',
            fontFamily: 'Vonique64',
            marginTop: 5,
          }}>
          {'LOGIN'}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../Images/arrowRight.png')}
          style={{
            height: 125,
            width: 125,
            marginRight: 10,
            marginTop: 10,
          }}></Image>
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 12,
            fontFamily: 'Vonique64',
            textAlign: 'center',
          }}>
          {'OR'}
        </Text>
        <Image
          source={require('../../Images/arrowLeft.png')}
          style={{
            height: 125,
            width: 125,
            marginLeft: 10,
            marginTop: 10,
          }}></Image>
      </View>
      <TouchableOpacity
        // @ts-ignore
        onPress={() => onPressCreateAccount()}
        style={{
          backgroundColor: '#b6e7cc',
          minHeight: 35,
          width: screenWidth * 0.4,
          justifyContent: 'center',
          borderRadius: 10,
          marginBottom: 80,
          marginTop: 10,
        }}>
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 12,
            textAlign: 'center',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 5,
            fontFamily: 'Vonique64',
          }}>
          {'CREATE ACCOUNT'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={errorModalVisible}
        animationType={'fade'}
        transparent={true}
        onRequestClose={toggleErrorModal}>
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
              borderRadius: 5,
              padding: 20,
            }}>
            <TouchableOpacity
              onPress={closeErrorModal}
              style={{alignSelf: 'flex-end'}}>
              <Image
                style={{height: 25, width: 25}}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#0c0b09',
                  marginTop: 60,
                }}>
                {errorMessage}
              </Text>
              <TouchableOpacity
                onPress={closeErrorModal}
                style={{
                  backgroundColor: '#fb445c',
                  minHeight: 35,
                  width: screenWidth * 0.4,
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: '#0c0b09',
                    fontSize: 12,
                    textAlign: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 5,
                    fontFamily: 'Vonique64',
                  }}>
                  {'Close'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={signupModalVisible}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleSignupModal}>
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
              borderRadius: 5,
              padding: 20,
            }}>
            <TouchableOpacity
              onPress={closeSignupModal}
              style={{alignSelf: 'flex-end'}}>
              <Image
                style={{height: 25, width: 25}}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <>
                <TextInput
                  style={{
                    backgroundColor: '#0c0b09',
                    color: '#eee7da',
                    width: 175,
                    marginBottom: 10,
                    marginTop: 40,
                    borderRadius: 10,
                    minHeight: 40,
                    borderWidth: 1,
                    borderColor: 'black',
                    textAlign: 'center',
                    fontFamily: 'Vonique64',
                  }}
                  placeholder=" email"
                  placeholderTextColor={'#eee7da'}
                  autoCapitalize={'none'}
                  value={emailCreate}
                  onChangeText={val => setEmailCreate(val)}
                />
                <TextInput
                  style={{
                    backgroundColor: '#0c0b09',
                    color: '#eee7da',
                    width: 175,
                    marginHorizontal: 10,
                    borderRadius: 10,
                    minHeight: 40,
                    borderWidth: 1,
                    borderColor: 'black',
                    textAlign: 'center',
                    fontFamily: 'Vonique64',
                  }}
                  placeholder=" password"
                  placeholderTextColor={'#eee7da'}
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  value={passwordCreate}
                  onChangeText={val => setPasswordCreate(val)}
                />
              </>
              <TouchableOpacity
                onPress={signUp}
                style={{
                  backgroundColor: '#fb445c',
                  minHeight: 35,
                  width: screenWidth * 0.4,
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: '#0c0b09',
                    fontSize: 12,
                    textAlign: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 5,
                    fontFamily: 'Vonique64',
                  }}>
                  {'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default LoginScreen;
