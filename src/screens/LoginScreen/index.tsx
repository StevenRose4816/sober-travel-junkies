import {FC, useState} from 'react';
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
import {Controller, useForm} from 'react-hook-form';
import {
  setFullname,
  setEmail as dispatchSetEmail,
  setMailingAddress,
  setPhoneNumber,
} from '../../store/user/slice';

interface IDefaultFormValues {
  fullName: string;
  phoneNumber: string;
  mailingAddress: string;
  email: string;
  username: string;
  password: string;
}

const LoginScreen: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [formattedErrorMessage, setFormattedErrorMessage] = useState<
    string | undefined
  >(undefined);
  const screenWidth = Dimensions.get('window').width;

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(userName, password);
    } catch (e: any) {
      formatError(e.message);
      console.log(e);
      setErrorModalVisible(!errorModalVisible);
    }
  };

  const onPressCreateAccount = () => {
    if (formattedErrorMessage) {
      setFormattedErrorMessage(undefined);
    }
    setSignupModalVisible(!signupModalVisible);
    reset();
  };

  const signUp = async (formValues: IDefaultFormValues) => {
    setSignupModalVisible(!signupModalVisible);
    try {
      await auth().createUserWithEmailAndPassword(
        formValues.username,
        formValues.password,
      );
      dispatch(setNewUser({newUser: true}));
      dispatch(setFullname({fullname: formValues.fullName}));
      dispatch(dispatchSetEmail({email: formValues.email}));
      dispatch(setMailingAddress({mailingAddress: formValues.mailingAddress}));
      dispatch(setPhoneNumber({phoneNumber: formValues.phoneNumber}));
      // create action to set user name in state. then send it with data to database on next screen
    } catch (e: any) {
      console.log('error signing up: ', e);
      formatError(e.message);
      setErrorModalVisible(!errorModalVisible);
    }
  };

  const closeErrorModal = () => {
    setErrorModalVisible(!errorModalVisible);
    reset();
  };

  const closeSignupModal = () => {
    setSignupModalVisible(!signupModalVisible);
    reset();
  };

  const formatError = (errorMessage: string) => {
    if (!!errorMessage) {
      const formatErrorMessage: string | undefined = errorMessage.split(']')[1];
      setFormattedErrorMessage(formatErrorMessage);
      return formattedErrorMessage;
    }
  };

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
  } = useForm<IDefaultFormValues>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      mailingAddress: '',
      email: '',
      username: '',
      password: '',
    },
    mode: 'onBlur',
  });

  return (
    <ImageBackground
      source={require('../../Images/STJLogin.jpeg')}
      style={styles.imageBackground1}>
      <Image
        source={require('../../Images/STJ.png')}
        style={styles.image1}></Image>
      <TextInput
        style={styles.textInput1}
        placeholder=" user name"
        placeholderTextColor={'#eee7da'}
        autoCapitalize={'none'}
        value={userName}
        onChangeText={userName => setUserName(userName)}
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
        onPress={onPressCreateAccount}
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
        onRequestClose={() => setErrorModalVisible(!errorModalVisible)}>
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
        onRequestClose={() => setSignupModalVisible(!signupModalVisible)}>
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
            <Controller
              control={control}
              name={'fullName'}
              rules={{required: true}}
              render={({field: {onChange, value, onBlur}}) => (
                <View>
                  <TextInput
                    style={styles.textInput}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder=" Full Name"
                    textAlign="center"
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={'phoneNumber'}
              rules={{required: true}}
              render={({field: {onChange, value, onBlur}}) => (
                <View>
                  <TextInput
                    style={styles.textInput}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder=" Phone Number"
                    textAlign="center"
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={'mailingAddress'}
              rules={{required: true}}
              render={({field: {onChange, value, onBlur}}) => (
                <View>
                  <TextInput
                    style={styles.textInput}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder=" Mailing Address"
                    textAlign="center"
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={'email'}
              rules={{required: true}}
              render={({field: {onChange, value, onBlur}}) => (
                <View>
                  <TextInput
                    style={styles.textInput}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder=" Email Address"
                    textAlign="center"
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={'username'}
              rules={{required: true}}
              render={({field: {onChange, value, onBlur}}) => (
                <View>
                  <TextInput
                    style={styles.textInput}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder=" User Name"
                    textAlign="center"
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={'password'}
              rules={{required: true}}
              render={({field: {onChange, value, onBlur}}) => (
                <View>
                  <TextInput
                    style={styles.textInput}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder=" Password"
                    textAlign="center"
                    secureTextEntry={true}
                  />
                </View>
              )}
            />
            <TouchableOpacity
              disabled={!isValid}
              onPress={handleSubmit(signUp)}
              style={
                isValid
                  ? styles.textInput5
                  : [styles.textInput5, {backgroundColor: '#fb445c50'}]
              }>
              <Text
                style={
                  isValid ? styles.text6 : [styles.text6, {color: '#0c0b0950'}]
                }>
                {'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default LoginScreen;
