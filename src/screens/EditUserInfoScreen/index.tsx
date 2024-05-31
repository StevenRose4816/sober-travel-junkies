import {FC, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import UploadField from '../../components/UploadField';
import {useAppSelector} from '../../hooks';
import HomeScreenButton from '../../components/HomeScreenButton';
import {Controller, useForm} from 'react-hook-form';
import {get, onValue, ref, set} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import DocumentPickerModal from '../../components/HomeScreenButton/DocumentPickerModal';

interface IDefaultFormValues {
  fullname: string;
  phoneNumber: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bio: string;
  email: string;
}

const EditUserInfoScreen: FC = () => {
  const navigation = useNavigation<NavPropAny>();
  const userId = auth().currentUser?.uid;
  const userPhotoFromRedux = useAppSelector(state => state.user.userPhoto);
  const translateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cameraIcon: ImageSourcePropType = require('../../Images/camerapictureicon.png');
  const ndaIcon: ImageSourcePropType = require('../../Images/ndaicon.png');
  const logo: ImageSourcePropType = require('../../Images/STJLogoTransparent.png');
  const background1: ImageSourcePropType = require('../../Images/backgroundPhoto1.jpeg');
  const [isVisible, setIsVisible] = useState(false);

  const writeToRealTimeDB = async (
    userId: string | undefined,
    formValues: any,
  ) => {
    console.log('userId: ', userId);
    set(ref(db, 'users/' + userId), {
      fullName: formValues.fullname || '',
      email: formValues.email || '',
      address: formValues.address || '',
      phoneNumber: formValues.phoneNumber || '',
      userPhoto: userPhotoFromRedux || '',
      emergencyContact: formValues.emergencyContact || '',
      emergencyContactPhone: formValues.emergencyContactPhone || '',
      bio: formValues.bio || '',
    })
      .then(() => {
        console.log('RTDB updated');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<IDefaultFormValues>({
    defaultValues: {
      fullname: '',
      phoneNumber: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      bio: '',
      email: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    moveImage();
  }, []);

  const moveImage = () => {
    Animated.timing(translateX, {
      toValue: screenWidth * 0.33,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const onSubmit = (formValues: IDefaultFormValues) => {
    writeToRealTimeDB(userId, formValues);
    navigation.navigate(Routes.home_Screen);
  };

  const onRequestClose = () => {
    setIsVisible(false);
  };

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          source={background1}>
          <Image style={styles.logoImage} source={logo} />
          <Image
            style={styles.userPhoto}
            source={
              userPhotoFromRedux
                ? {uri: userPhotoFromRedux}
                : require('../../Images/profilepictureicon.png')
            }
          />
          <UploadField
            onPress={() => navigation.navigate(Routes.imagePicker)}
            source={cameraIcon}
            label={'Upload Photo?'}
            translateX={translateX}
          />
          <UploadField
            source={ndaIcon}
            label={'Upload NDA?'}
            translateX={translateX}
            marginLeft={19}
            onPress={() => setIsVisible(true)}
          />
          <HomeScreenButton
            title={'Change Background Photo'}
            onPress={() => console.log('pressed')}
          />
          <Controller
            control={control}
            name={'fullname'}
            rules={{required: true}}
            render={({field: {onChange, value, onBlur}}) => (
              <View>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder=" Full Name"
                  textAlign="left"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name={'phoneNumber'}
            // rules={{required: true}}
            render={({field: {onChange, value, onBlur}}) => (
              <View>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder=" Phone Number"
                  textAlign="left"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name={'email'}
            // rules={{required: true}}
            render={({field: {onChange, value, onBlur}}) => (
              <View>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder=" Email Address"
                  textAlign="left"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name={'address'}
            // rules={{required: true}}
            render={({field: {onChange, value, onBlur}}) => (
              <View>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder=" Address"
                  textAlign="left"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name={'emergencyContactName'}
            // rules={{required: true}}
            render={({field: {onChange, value, onBlur}}) => (
              <View>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder=" Emergency Contact Name"
                  textAlign="left"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name={'emergencyContactPhone'}
            // rules={{required: true}}
            render={({field: {onChange, value, onBlur}}) => (
              <View>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder=" Emergency Contact Phone number"
                  textAlign="left"
                />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.submitTouchable}>
            <Text style={styles.submitText}>{'Submit'}</Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
      <DocumentPickerModal
        isVisible={isVisible}
        onRequestClose={onRequestClose}
      />
    </View>
  );
};

export default EditUserInfoScreen;
