import {FC, useEffect, useRef, useState} from 'react';
import storage from '@react-native-firebase/storage';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
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
import {useForm, Controller} from 'react-hook-form';
import {set, ref, update, get} from 'firebase/database';
import {db} from '../../Firebase/FirebaseConfigurations';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import DocumentPickerModal from '../../components/DocumentPickerModal';
import SubmitUserInfoButton from '../../components/SubmitUserInfoButton';
import BackgroundPickerModal from '../../components/BackgroundPickerModal';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';

interface IDataFromStorage {
  address: string;
  email: string;
  phoneNumber: string;
  userPhoto: string;
  fullName: string;
  backgroundphoto: string;
}

interface IDefaultFormValues {
  fullname: string;
  phoneNumber: string;
  address: string;
  email: string;
}

const EditUserInfoScreen: FC = () => {
  const navigation = useNavigation<NavPropAny>();
  const dispatch = useDispatch();
  const userId = auth().currentUser?.uid;
  const userPhotoFromRedux = useAppSelector(state => state.user.userPhoto);
  const newUser = useAppSelector(state => state.globalStore.newUser);
  const translateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const cameraIcon: ImageSourcePropType = require('../../Images/camerapictureicon.png');
  const ndaIcon: ImageSourcePropType = require('../../Images/ndaicon.png');
  const logo: ImageSourcePropType = require('../../Images/STJLogoTransparent.png');
  const [docPickerVisible, setDocPickerIsVisible] = useState(false);
  const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);
  const backgroundphoto = useAppSelector(state => state.user.uri);
  const [localSourceUri, setLocalSourceUri] = useState<string | undefined>(
    backgroundphoto,
  );
  const [photoPressed, setPhotoPressed] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
  });
  const [dataFromStorage, setDataFromStorage] = useState<IDataFromStorage>({
    address: '',
    email: '',
    phoneNumber: '',
    userPhoto: '',
    fullName: '',
    backgroundphoto: '',
  });
  const [load, setLoad] = useState(false);
  const selectedDocument = useAppSelector(
    state => state.document.selectedDocument,
  );

  const uploadDocument = async () => {
    const currentUser = auth().currentUser!;
    const filename = `${currentUser.uid}_NDA`;
    const document = selectedDocument[0].uri || [];

    console.log('document: ', document);

    const uploadUri =
      Platform.OS === 'ios' ? document.replace('file://', '') : document;
    const task = storage().ref(filename).putFile(uploadUri);
    try {
      await task;
      Alert.alert('Your NDA has been uploaded to Firebase Cloud Storage!');
    } catch (e) {
      console.error(e);
      Alert.alert(
        'Upload failed',
        'Something went wrong while uploading your NDA.',
      );
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={styles.logoutTouchable}>
          <Text style={styles.logoutText}>{'Log out'}</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const logout = () => {
    auth().signOut();
    dispatch({type: 'LOGOUT'});
  };

  const updateRealTimeDB = async (
    userId: string | undefined,
    formValues?: any,
  ) => {
    const updates: {[key: string]: string | undefined} = {};
    if (!!formValues.fullname)
      updates['/users/' + userId + '/fullName'] = formValues.fullname;
    if (!!formValues.email)
      updates['/users/' + userId + '/email'] = formValues.email;
    if (!!formValues.address)
      updates['/users/' + userId + '/address'] = formValues.address;
    if (!!formValues.phoneNumber)
      updates['/users/' + userId + '/phoneNumber'] = formValues.phoneNumber;
    if (!!userPhotoFromRedux)
      updates['/users/' + userId + '/userPhoto'] = userPhotoFromRedux;
    if (photoPressed) {
      if (photoPressed.first) {
        updates['/users/' + userId + '/backgroundphoto'] = '1';
      } else if (photoPressed.second) {
        updates['/users/' + userId + '/backgroundphoto'] = '2';
      } else if (photoPressed.third) {
        updates['/users/' + userId + '/backgroundphoto'] = '3';
      } else if (photoPressed.fourth) {
        updates['/users/' + userId + '/backgroundphoto'] = '4';
      }
    }

    return update(ref(db), updates)
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
      email: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    moveImage();
    readDataFromRealTimeDB();
  }, []);

  const moveImage = () => {
    Animated.timing(translateX, {
      toValue: screenWidth * 0.33,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const readDataFromRealTimeDB = async () => {
    if (!userId) return;
    const countRef = ref(db, 'users/' + userId);
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setDataFromStorage(data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading data from the database:', error);
    }
  };

  const onSubmit = (formValues: IDefaultFormValues) => {
    updateRealTimeDB(userId, formValues);
    navigation.navigate(Routes.home_Screen);
  };

  const backgroundsource = () => {
    if (dataFromStorage.backgroundphoto === '1') {
      return require('../../Images/backgroundPhoto1.jpeg');
    } else if (dataFromStorage.backgroundphoto === '2') {
      return require('../../Images/backgroundPhoto2.jpeg');
    } else if (dataFromStorage.backgroundphoto === '3') {
      return require('../../Images/backgroundPhoto3.jpeg');
    } else if (dataFromStorage.backgroundphoto === '4') {
      return require('../../Images/backgroundPhoto4.jpeg');
    }
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
    }
  };

  return (
    <View style={styles.containerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          source={backgroundsource()}>
          <Image style={styles.logoImage} source={logo} />
          <View style={styles.imageContainer}>
            {load && <ActivityIndicator size="large" color="#0000ff" />}
            <FastImage
              style={
                load || newUser
                  ? styles.userPhotoWithOutBorder
                  : styles.userPhotoWithBorder
              }
              source={
                userPhotoFromRedux
                  ? {uri: userPhotoFromRedux}
                  : require('../../Images/profilepictureicon.png')
              }
              onLoadStart={() => {
                setLoad(true);
              }}
              onLoadEnd={() => {
                setLoad(false);
              }}
              resizeMode={FastImage.resizeMode.cover}
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
            rules={{required: false}}
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
            rules={{required: false}}
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
            rules={{required: false}}
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
            rules={{required: false}}
            render={({field: {onChange, value, onBlur}}) => (
              <View>
                <TextInput
                  style={styles.textInput}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder=" Mailing Address"
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
        uploadDocument={uploadDocument}
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
