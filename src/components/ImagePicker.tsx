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
  OptionsCommon,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../store/user/slice';
import Routes from '../navigation/routes';
import {NavPropAny} from '../navigation/types';

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
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  console.log('routes=', routes);
  console.log('previous route=', prevRoute);

  useEffect(() => {
    moveImage();
  }, [selectedImage]);

  const navAway = () => {
    dispatch(setUserPhoto({userPhoto: selectedImage}));
    navigate(Routes.homeScreen);
  };

  const photo = 'photo' as MediaType;

  const openImagePicker = () => {
    const options = {
      mediaType: photo,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorCode);
      } else {
        console.log('response.assets=', response.assets?.[0]);
        console.log('response.assets.[0].uri=', response.assets?.[0]?.uri);
        let imageUri = response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        translateX.setValue(0);
        translateY.setValue(0);
      }
    });
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: photo,
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
        // Process the captured image
        let imageUri = response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
  };

  const moveImage = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true, // Delay translateY animation (same as translateX duration)
      }),
      Animated.timing(translateY, {
        toValue: 200,
        duration: 500,
        useNativeDriver: true,
        delay: 500,
      }),
    ]).start(() => {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(translateY, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {selectedImage && (
        <>
          <Image
            resizeMode="center"
            source={{uri: selectedImage}}
            style={{marginBottom: 20, height: 300, width: 300}}
          />
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{translateX}, {translateY}],
            }}>
            <TouchableOpacity
              onPress={navAway}
              style={{
                backgroundColor: '#b6e7cc',
                borderRadius: 5,
                marginBottom: 20,
                width: 100,
                borderWidth: 1,
                borderColor: '#eee7da',
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
        </>
      )}
      <View
        style={{
          marginTop: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
          onPress={openImagePicker}>
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
      </View>
    </View>
  );
};

export default ImagePicker;
