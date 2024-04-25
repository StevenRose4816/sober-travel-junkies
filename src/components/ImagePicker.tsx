import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto as setThisUserPhoto} from '../store/user/slice';
import Routes from '../navigation/routes';
import {NavPropAny} from '../navigation/types';
import {supabase} from '../screens/SupabaseConfig';

const ImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const {navigate} = useNavigation<NavPropAny>();
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const translateXLooksGood = useRef(new Animated.Value(0)).current;
  const translateYLooksGood = useRef(new Animated.Value(0)).current;
  const translateXChoose = useRef(new Animated.Value(0)).current;
  const translateYChoose = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const [userPhoto, setUserPhoto] = useState<any>();

  const uploadPhoto = async (uri: any) => {
    // animateTouchables();
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      console.log('arrayBuffer.byteLength: ', arrayBuffer.byteLength);
      const fileName = 'photo' + new Date().getTime();
      const contentType = 'image/jpeg';
      const {data, error} = await supabase.storage
        .from('Photos2')
        .upload(fileName, arrayBuffer, {contentType});

      if (error) {
        console.error('Error uploading photo:', error.message);
      } else {
        const photoUrl = data?.path;
        setUserPhoto(photoUrl);
        console.log('Uploaded photo URL:', photoUrl);
      }
    } catch (e: any) {
      console.error('Error uploading photo:', e.message);
    }
  };

  const onPressThisLooksGood = async () => {
    await uploadPhoto(selectedImage);
    dispatch(setThisUserPhoto({userPhoto: selectedImage}));
    navigate(Routes.homeScreen);
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
        // await uploadPhoto(uri);
      }
    });
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorCode);
      } else {
        let imageUri = response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
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
        <View style={{marginBottom: 20, height: 300, width: 300}}></View>
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
      </View>
    </View>
  );
};

export default ImagePicker;
