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
import {setNewUser} from '../../store/globalStore/slice';
import {useDispatch} from 'react-redux';
import styles from './styles';

const LoginScreen: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [formattedErrorMessage, setFormattedErrorMessage] = useState<
    string | undefined
  >(undefined);
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
      formatError(e.message);
      console.log(e);
      toggleErrorModal();
    }
  };

  const onPressCreateAccount = () => {
    toggleSignupModal();
    setEmailCreate('');
    setPasswordCreate('');
    formattedErrorMessage && setFormattedErrorMessage(undefined);
  };

  const signUp = async () => {
    toggleSignupModal();
    try {
      await auth().createUserWithEmailAndPassword(emailCreate, passwordCreate);
      dispatch(setNewUser({newUser: true}));
    } catch (e: any) {
      formatError(e.message);
      toggleErrorModal();
    }
  };

  const closeErrorModal = () => {
    setPasswordCreate('');
    setEmailCreate('');
    toggleErrorModal();
  };

  const closeSignupModal = () => {
    setPasswordCreate('');
    setEmailCreate('');
    toggleSignupModal();
  };

  const formatError = (errorMessage: string) => {
    if (!!errorMessage) {
      const formatErrorMessage: string | undefined = errorMessage.split(']')[1];
      setFormattedErrorMessage(formatErrorMessage);
      return formattedErrorMessage;
    }
  };

  return (
    <ImageBackground
      source={require('../../Images/STJLogin.jpeg')}
      style={styles.imageBackground1}>
      <Image
        source={require('../../Images/STJ.png')}
        style={styles.image1}></Image>
      <TextInput
        style={styles.textInput1}
        placeholder=" email"
        placeholderTextColor={'#eee7da'}
        autoCapitalize={'none'}
        value={email}
        onChangeText={email => setEmail(email)}
      />
      <TextInput
        style={styles.textInput2}
        placeholder=" password"
        placeholderTextColor={'#eee7da'}
        value={password}
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={login}
        style={[
          styles.touchable1,
          {
            width: screenWidth * 0.3,
          },
        ]}>
        <Text style={styles.text1}>{'LOGIN'}</Text>
      </TouchableOpacity>
      <View style={styles.view1}>
        <Image
          source={require('../../Images/arrowRight.png')}
          style={styles.image2}></Image>
        <Text style={styles.text2}>{'OR'}</Text>
        <Image
          source={require('../../Images/arrowLeft.png')}
          style={styles.image3}></Image>
      </View>
      <TouchableOpacity
        onPress={() => onPressCreateAccount()}
        style={[
          styles.touchable2,
          {
            width: screenWidth * 0.4,
          },
        ]}>
        <Text style={styles.text3}>{'CREATE ACCOUNT'}</Text>
      </TouchableOpacity>
      <Modal
        visible={errorModalVisible}
        animationType={'fade'}
        transparent={true}
        onRequestClose={toggleErrorModal}>
        <View style={styles.view2}>
          <View style={styles.view3}>
            <View style={styles.view4}>
              <Text style={styles.text4}>{formattedErrorMessage}</Text>
              <TouchableOpacity
                onPress={closeErrorModal}
                style={[
                  styles.touchable3,
                  {
                    width: screenWidth * 0.4,
                  },
                ]}>
                <Text style={styles.text5}>{'Close'}</Text>
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
        <View style={styles.view5}>
          <View style={styles.view6}>
            <TouchableOpacity
              onPress={closeSignupModal}
              style={styles.touchable4}>
              <Image
                style={styles.image4}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
            <View style={styles.view7}>
              <>
                <TextInput
                  style={styles.textInput3}
                  placeholder=" email"
                  placeholderTextColor={'#eee7da'}
                  autoCapitalize={'none'}
                  value={emailCreate}
                  onChangeText={val => setEmailCreate(val)}
                />
                <TextInput
                  style={styles.textInput4}
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
                style={[
                  styles.textInput5,
                  {
                    width: screenWidth * 0.4,
                  },
                ]}>
                <Text style={styles.text6}>{'Submit'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default LoginScreen;
