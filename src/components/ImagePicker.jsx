import React, {useState} from 'react';
import {Button, Image, View, TouchableOpacity, Text} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../store/user/slice';

const ImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  const navAway = () => {
    dispatch(setUserPhoto({userPhoto: selectedImage}));
    navigate('Home Screen');
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        console.log('response.uri=', response.uri);
        console.log('response.assets.[0].uri=', response.assets?.[0]?.uri);
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        // Process the captured image
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {selectedImage && (
        <>
          <Image
            source={{uri: selectedImage}}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={navAway}
            style={{
              backgroundColor: 'blue',
              minHeight: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginHorizontal: 10,
              marginTop: 20,
              marginBottom: 20,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 21,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'This looks good!'}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <View style={{marginTop: 20}}>
        <Button title="Choose from Device" onPress={openImagePicker} />
        <Button title="Open Camera" onPress={handleCameraLaunch} />
      </View>
    </View>
  );
};

export default ImagePicker;
