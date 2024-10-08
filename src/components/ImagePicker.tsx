import React, {useRef, useState} from 'react';
import * as Progress from 'react-native-progress';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {getDownloadURL, getStorage, ref as storageRef} from 'firebase/storage';
import {set, ref, update, get} from 'firebase/database';
import {db} from '../Firebase/FirebaseConfigurations';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto as setThisUserPhoto} from '../store/user/slice';
import Routes from '../navigation/routes';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppSelector} from '../hooks';

const ImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const dispatch = useDispatch();
  const translateXLooksGood = useRef(new Animated.Value(0)).current;
  const translateYLooksGood = useRef(new Animated.Value(0)).current;
  const translateXChoose = useRef(new Animated.Value(0)).current;
  const translateYChoose = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const userId = auth().currentUser?.uid;

  const uploadImage = async () => {
    const uri = selectedImage;
    const currentUser = auth().currentUser!;
    // Concatenate UID with 'profilePic'
    const filename =
      prevRoute.name === 'editUserInfoScreen' || 'home_Screen'
        ? `${currentUser.uid}_profilePic`
        : `${currentUser.uid}_visionBoardPic`;
    const uploadUri = Platform.OS === 'ios' ? uri?.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uploadUri || '');
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    setSelectedImage(undefined);
    getProfilePicFromStorage(userId + '_profilePic');
  };

  const getProfilePicFromStorage = async (
    imageName: string,
  ): Promise<string | undefined> => {
    const storage = getStorage();
    const reference = storageRef(storage, imageName);
    try {
      const url = await getDownloadURL(reference);
      console.log('url that is being written to db: ', url);
      return url;
    } catch (e: any) {
      console.log(e.message);
      return undefined;
    }
  };

  const onPressThisLooksGood = async () => {
    console.log('prevRoute.name: ', prevRoute.name);
    if (
      prevRoute.name === 'editUserInfoScreen' ||
      prevRoute.name === 'home_Screen'
    ) {
      await uploadImage();
      const url = await getProfilePicFromStorage(userId + '_profilePic');
      if (url) {
        await updateRealTimeDB(userId, url);
        dispatch(setThisUserPhoto({userPhoto: url}));
      }
      navigation.navigate(Routes[prevRoute.name]);
    } else {
      navigation.navigate('visionBoardScreen', {selectedImage});
    }
  };

  const updateRealTimeDB = async (
    userId: string | undefined,
    firebaseUrl?: any,
  ) => {
    const updates: {[key: string]: string | undefined} = {};
    if (!!firebaseUrl) updates['/users/' + userId + '/userPhoto'] = firebaseUrl;
    return update(ref(db), updates)
      .then(() => {
        console.log('RTDB updated');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const resetValues = () => {
    translateXLooksGood.setValue(0);
    translateYLooksGood.setValue(0);
    translateXChoose.setValue(0);
    translateYChoose.setValue(0);
    scaleX.setValue(1);
  };

  const onPressChooseFromDevice = () => {
    //if there is a selectedImage already, we want to launch the imagePicker but also reset animation values
    openImagePicker();
    //timeout here so user doesnt see text transition
    if (selectedImage) {
      setTimeout(() => resetValues(), 500);
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: true,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorCode);
      } else {
        let uri = response.assets?.[0]?.uri;
        setSelectedImage(uri);
        animateTouchables();
        return selectedImage;
      }
    });
  };

  const handleCameraLaunch = () => {
    console.log('handle camera launch');
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchCamera(options, response => {
      console.log('launched camera');
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorCode);
      } else {
        let imageUri = response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    }).catch(error => console.log('error: ', error));
  };

  const animateTouchables = () => {
    Animated.parallel([
      Animated.timing(translateYLooksGood, {
        toValue: -132,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYChoose, {
        toValue: 132,
        duration: 500,
        useNativeDriver: true,
        delay: 500,
      }),
    ]).start();
    Animated.timing(scaleX, {
      toValue: 1.2,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {selectedImage ? (
        <Image
          resizeMode="cover"
          source={{uri: selectedImage}}
          style={{marginBottom: 20, height: 300, width: 300}}
        />
      ) : (
        <View style={{marginBottom: 20, height: 300, width: 300}} />
      )}
      <View
        style={{
          marginTop: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.View
          style={{
            transform: [
              {translateX: translateXChoose},
              {translateY: translateYChoose},
            ],
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#b6e7cc',
              borderRadius: 5,
              marginBottom: 20,
              width: 100,
              borderWidth: 1,
              borderColor: '#eee7da',
            }}
            onPress={onPressChooseFromDevice}>
            <Text
              style={{
                color: '#0c0b09',
                fontSize: 12,
                margin: 10,
                textAlign: 'center',
                fontFamily: 'HighTide-Sans',
              }}>
              {'Choose from Device'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View>
          <TouchableOpacity
            style={{
              backgroundColor: '#b6e7cc',
              borderRadius: 5,
              marginBottom: 20,
              width: 100,
              borderWidth: 1,
              borderColor: '#eee7da',
            }}
            onPress={handleCameraLaunch}>
            <Text
              style={{
                color: '#0c0b09',
                fontSize: 12,
                margin: 10,
                textAlign: 'center',
                fontFamily: 'HighTide-Sans',
              }}>
              {'Open Camera'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {translateX: translateXLooksGood},
              {translateY: translateYLooksGood},
              {scale: scaleX},
            ],
          }}>
          <TouchableOpacity
            onPress={onPressThisLooksGood}
            disabled={!selectedImage}
            style={{
              backgroundColor: '#b6e7cc',
              borderRadius: 5,
              marginBottom: 20,
              width: 100,
              borderWidth: 1,
              borderColor: '#eee7da',
              opacity: selectedImage ? 1 : 0.5,
            }}>
            <Text
              style={{
                color: '#0c0b09',
                fontSize: 12,
                margin: 10,
                textAlign: 'center',
                fontFamily: 'HighTide-Sans',
              }}>
              {'This looks good'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        {uploading && <Progress.Bar progress={transferred} width={300} />}
      </View>
    </View>
  );
};

export default ImagePicker;
