import {FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import styles from './styles';
import UploadField from '../../components/UploadField';
import {useAppSelector} from '../../hooks';
import HomeScreenButton from '../../components/HomeScreenButton';
import {useForm, Controller} from 'react-hook-form';
import {set, ref} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import DocumentPickerModal from '../../components/DocumentPickerModal';
import SubmitUserInfoButton from '../../components/SubmitUserInfoButton';
import BackgroundPickerModal from '../../components/BackgroundPickerModal';

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
  const cameraIcon: ImageSourcePropType = require('../../Images/camerapictureicon.png');
  const ndaIcon: ImageSourcePropType = require('../../Images/ndaicon.png');
  const logo: ImageSourcePropType = require('../../Images/STJLogoTransparent.png');
  const [docPickerVisible, setDocPickerIsVisible] = useState(false);
  const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);
  const [photoPressed, setPhotoPressed] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
  });
  const [load, setLoad] = useState(false);

  const writeToRealTimeDB = async (
    userId: string | undefined,
    formValues: any,
  ) => {
    set(ref(db, 'users/' + userId), {
      fullName: formValues.fullname || '',
      email: formValues.email || '',
      address: formValues.address || '',
      phoneNumber: formValues.phoneNumber || '',
      userPhoto: userPhotoFromRedux || '',
      emergencyContact: formValues.emergencyContact || '',
      emergencyContactPhone: formValues.emergencyContactPhone || '',
      bio: formValues.bio || '',
      backgroundPhoto: source(),
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
    const selectedSource = source();
    navigation.navigate(Routes.home_Screen, {source: selectedSource});
  };

  const source = () => {
    if (photoPressed.first) {
      return require('../../Images/backgroundPhoto1.jpeg');
    } else if (photoPressed.second) {
      return require('../../Images/backgroundPhoto2.jpeg');
    } else if (photoPressed.third) {
      return require('../../Images/backgroundPhoto3.jpeg');
    } else if (photoPressed.fourth) {
      return require('../../Images/backgroundPhoto4.jpeg');
    } else {
      return require('../../Images/backgroundPhoto1.jpeg');
    }
  };

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          source={source()}>
          <Image style={styles.logoImage} source={logo} />
          <View style={styles.imageContainer}>
            {load && <ActivityIndicator size="large" color="#0000ff" />}
            <Image
              style={
                load
                  ? styles.userPhotoWithOutBorder
                  : styles.userPhotoWithBorder
              }
              source={
                userPhotoFromRedux
                  ? {uri: userPhotoFromRedux}
                  : require('../../Images/profilepictureicon.png')
              }
              onLoadStart={() => {
                console.log('load start: ', load);
                setLoad(true);
              }}
              onLoadEnd={() => {
                console.log('load end: ', load);
                setLoad(false);
              }}
            />
          </View>
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
            onPress={() => setDocPickerIsVisible(true)}
          />
          <HomeScreenButton
            title={'Change Background Photo'}
            onPress={() => setBackgroundModalVisible(true)}
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
            rules={{required: true}}
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
            rules={{required: true}}
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
            rules={{required: true}}
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
            rules={{required: true}}
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
            rules={{required: true}}
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
          <SubmitUserInfoButton
            onPress={handleSubmit(onSubmit)}
            isValid={isValid}
          />
        </ImageBackground>
      </ScrollView>
      <DocumentPickerModal
        isVisible={docPickerVisible}
        onRequestClose={() => setDocPickerIsVisible(false)}
      />
      <BackgroundPickerModal
        isVisible={backgroundModalVisible}
        onRequestClose={() => setBackgroundModalVisible(false)}
        setPhotoPressed={setPhotoPressed}
        photoPressed={photoPressed}
      />
    </View>
  );
};

export default EditUserInfoScreen;
