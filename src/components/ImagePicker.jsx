import React, {useState} from 'react';
import {
  Button,
  Image,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUserPhoto} from '../store/user/slice';
import {setSelected} from '../store/photo/slice';
import Routes from '../navigation/routes';

const ImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const {navigate} = useNavigation();
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  console.log('routes=', routes);
  console.log('previous route=', prevRoute);

  const navAway = () => {
    dispatch(setUserPhoto({userPhoto: selectedImage}));
    // dispatch(setSelected({selected: true}));
    navigate(Routes.homeScreen);
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {selectedImage && (
        <>
          <Image
            resizeMode="center"
            source={{uri: selectedImage}}
            style={{marginBottom: 20, height: 300, width: 300}}
          />
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={navAway}
              style={{
                backgroundColor: 'blue',
                justifyContent: 'center',
                borderRadius: 5,
                width: '70%',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 5,
                  marginBottom: 5,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                {'This looks good!'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={openImagePicker}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              fontSize: 12,
              fontWeight: '600',
            }}>
            {'Choose from Device'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            borderRadius: 5,
          }}
          onPress={handleCameraLaunch}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              fontSize: 12,
              fontWeight: '600',
            }}>
            {'Open Camera'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePicker;
