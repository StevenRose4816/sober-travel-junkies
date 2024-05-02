import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Routes from '../../navigation/routes';
import {AppStackParams, NavPropAny} from '../../navigation/types';
import Draggable from 'react-native-draggable';
import {getDownloadURL, getStorage, ref as thisRef} from 'firebase/storage';
import {captureScreen} from 'react-native-view-shot';
import storage from '@react-native-firebase/storage';

export const VisionBoardScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.visionBoardScreen>>();
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const backgroundPhoto = route.params.backgroundPhoto;
  const {selectedImage} = route.params;
  const [showDraggable, setShowDraggable] = useState(true);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);
  const [addNote, setAddNote] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [visibleNote, setVisibleNote] = useState('');
  const [photoDragPosition, setPhotoDragPosition] = useState({
    x: 100,
    y: 100,
    pageX: 0,
    pageY: 0,
  });
  const [stickyDragPosition, setStickyDragPosition] = useState({
    x: 200,
    y: 100,
    pageX: 0,
    pageY: 0,
  });

  const [url, setUrl] = useState('');
  const [updatedBool, setUpdatedBool] = useState(false);
  const [screenShotUri, setScreenShotUri] = useState('');
  const [hideToucables, setHideToucables] = useState(false);
  const [showSelectedImage, setShowSelectedImage] = useState(true);
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const [photoShortPressCount, setPhotoShortPressCount] = useState(0);
  const [stickyShortPressCount, setStickyShortPressCount] = useState(0);
  const [photoDragSize, setPhotoDragSize] = useState({width: 70, height: 70});
  const [stickyDragSize, setStickyDragSize] = useState({
    width: 120,
    height: 80,
  });
  const [stickySize, setStickySize] = useState({
    fontSize: 8,
    maxWidth: 40,
  });
  const [showInitialPhotoDraggables, setShowInitialPhotoDraggables] =
    useState(false);
  const [showInitialStickyDraggables, setShowInitialStickyDraggables] =
    useState(false);

  const capScreen = async () => {
    try {
      const uri = await captureScreen({
        format: 'jpg',
        quality: 0.8,
        snapshotContentContainer: false,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height + 30,
      });
      setScreenShotUri(uri);
      setHideToucables(false);
      setVisibleNote('');
      setUpdatedBool(false);
      setShowSelectedImage(false);
      setShowInitialPhotoDraggables(false);
      setShowInitialStickyDraggables(false);
      await uploadImage(uri);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  useEffect(() => {
    if (hideToucables) {
      navigation.setOptions({
        headerLeft: () => null,
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{width: 20, height: 20, marginTop: 10}}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../Images/caret_left.png')}></Image>
          </TouchableOpacity>
        ),
      });
    }
  }, [hideToucables, navigation]);

  useEffect(() => {
    readFromStorage('visionBoardScreenShot');
  }, []);

  const uploadImage = async (uri: string | undefined) => {
    if (!uri) {
      console.error('Invalid URI:', uri);
      return;
    }
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const task = storage().ref('visionBoardScreenShot').putFile(uploadUri);
    try {
      await task;
      Alert.alert('Vision Board has updated in Firebase Cloud Storage.');
      readFromStorage('visionBoardScreenShot');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onPressCloseUpdateModal = () => {
    toggleModal();
    setUpdatedBool(false);
  };

  const onPressAddImage = () => {
    setShowInitialPhotoDraggables(true);
  };

  const onPressOpenImagePicker = () => {
    setShowSelectedImage(true);
    navigation.navigate('imagePicker');
  };

  const onAddNote = () => {
    showInitialStickyDraggables && toggleModal();
    !showInitialStickyDraggables && setShowInitialStickyDraggables(true);
  };

  const onSubmitNote = () => {
    setVisibleNote(newNote);
    setNewNote('');
    toggleModal();
  };

  const onUpdateBoard = async () => {
    toggleModal();
    setTimeout(() => capScreen(), 1000);
  };

  const onPressUpdateBoard = async () => {
    toggleModal();
    setHideToucables(true);
    setUpdatedBool(true);
  };

  const readFromStorage = async (imageName: string) => {
    const storage = getStorage();
    const reference = thisRef(storage, imageName);
    try {
      await getDownloadURL(reference).then(url => {
        setUrl(url);
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const onShortPressPhoto = () => {
    if (photoShortPressCount < 4) {
      const newWidth = photoDragSize.width * 1.1;
      const newHeight = photoDragSize.height * 1.1;
      setPhotoDragSize({width: newWidth, height: newHeight});
      setPhotoShortPressCount(prevCount => prevCount + 1);
    } else {
      setPhotoDragSize({width: 70, height: 70});
      setPhotoShortPressCount(0);
    }
  };

  const onShortPressSticky = () => {
    if (stickyShortPressCount < 4) {
      const newWidth = stickyDragSize.width * 1.1;
      const newHeight = stickyDragSize.height * 1.1;
      const newFontSize = stickySize.fontSize + 2;
      const newMaxWidth = stickySize.maxWidth * 1.1;
      setStickyDragSize({width: newWidth, height: newHeight});
      setStickyShortPressCount(prevCount => prevCount + 1);
      setStickySize({fontSize: newFontSize, maxWidth: newMaxWidth});
    } else {
      setStickyDragSize({width: 120, height: 80});
      setStickySize({fontSize: 8, maxWidth: 40});
      setStickyShortPressCount(0);
    }
  };

  return (
    <>
      <ImageBackground
        style={{flex: 1}}
        source={
          url !== ''
            ? {url}
            : screenShotUri
            ? {uri: screenShotUri}
            : backgroundPhoto
            ? backgroundPhoto
            : require('../../Images/backgroundPhoto1.jpeg')
        }>
        {!hideToucables && (
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              marginBottom: 10,
              marginTop: 20,
              fontFamily: 'HighTide-Sans',
            }}>
            Vision Board
          </Text>
        )}
        {showDraggable && showInitialPhotoDraggables && (
          <Draggable
            x={photoDragPosition.x}
            y={photoDragPosition.y}
            minX={0}
            minY={40}
            maxX={375}
            maxY={640}
            renderColor={hideToucables ? '#fb445c00' : '#fb445c'}
            renderText="A"
            isCircle
            onShortPressRelease={onShortPressPhoto}>
            <Image
              style={{
                width: photoDragSize.width,
                height: photoDragSize.height,
                borderRadius: 5,
              }}
              source={
                showSelectedImage && selectedImage
                  ? {
                      uri: selectedImage,
                    }
                  : require('../../Images/camerapictureicon.png')
              }
              resizeMode="stretch"></Image>
          </Draggable>
        )}
        {addNote && showInitialStickyDraggables && (
          <Draggable
            x={stickyDragPosition.x}
            y={stickyDragPosition.y}
            minX={0}
            minY={40}
            maxX={375}
            maxY={640}
            onShortPressRelease={onShortPressSticky}>
            <ImageBackground
              style={{
                width: stickyDragSize.width,
                height: stickyDragSize.height,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../../Images/sticky.png')}
              resizeMode="stretch">
              <Text
                style={{
                  fontFamily: 'HighTide-Sans',
                  fontSize: stickySize.fontSize,
                  maxWidth: stickySize.maxWidth,
                }}>
                {visibleNote}
              </Text>
            </ImageBackground>
          </Draggable>
        )}
      </ImageBackground>
      {!hideToucables && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0,
            left: 15,
            right: 15,
          }}>
          <TouchableOpacity
            onPress={
              showInitialPhotoDraggables
                ? onPressOpenImagePicker
                : onPressAddImage
            }
            style={{
              backgroundColor: '#e7b6cc',
              borderRadius: 5,
              width: 100,
              borderWidth: 1,
              borderColor: '#eee7da',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#0c0b09',
                textAlign: 'center',
                fontFamily: 'HighTide-Sans',
              }}>
              {!showInitialPhotoDraggables ? 'Add Image' : 'Open Image Picker'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressUpdateBoard}
            style={{
              backgroundColor: '#e7b6cc',
              borderRadius: 50,
              width: 80,
              height: 80,
              margin: 20,
              borderWidth: 1,
              borderColor: '#eee7da',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#0c0b09',
                fontFamily: 'HighTide-Sans',
                textAlign: 'center',
              }}>
              Update Board
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddNote}
            style={{
              backgroundColor: '#e7b6cc',
              borderRadius: 5,
              width: 100,
              borderWidth: 1,
              borderColor: '#eee7da',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#0c0b09',
                fontFamily: 'HighTide-Sans',
                textAlign: 'center',
              }}>
              {!showInitialStickyDraggables ? 'Add Note' : 'Write Note'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={modalVisible}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: '#b6e7cc',
              minHeight: 300,
              width: '80%',
              borderRadius: 5,
              padding: 20,
            }}>
            <TouchableOpacity
              onPress={onPressCloseUpdateModal}
              style={{alignSelf: 'flex-end'}}>
              <Image
                style={{height: 25, width: 25}}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {!updatedBool && (
                <>
                  <Text
                    style={{
                      color: '#0c0b09',
                      fontSize: 12,
                      textAlign: 'center',
                      marginLeft: 10,
                      marginRight: 10,
                      marginTop: 5,
                      fontFamily: 'Vonique64',
                    }}>
                    Add Note
                  </Text>
                  <TextInput
                    value={newNote}
                    placeholder=" Note"
                    onChangeText={note => setNewNote(note)}
                    secureTextEntry={false}
                    style={{
                      fontFamily: 'HighTide-Sans',
                      backgroundColor: '#eee7da',
                      borderRadius: 5,
                      height: 50,
                      width: 150,
                      borderWidth: 1,
                      borderColor: '#5A6472',
                      borderBottomWidth: 3,
                      marginTop: 40,
                      textAlign: 'center',
                    }}></TextInput>
                </>
              )}
              {updatedBool && (
                <Text
                  style={{
                    color: '#0c0b09',
                    fontSize: 12,
                    textAlign: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 40,
                    fontFamily: 'Vonique64',
                  }}>
                  Do you want to update the board?
                </Text>
              )}
              <TouchableOpacity
                onPress={!updatedBool ? onSubmitNote : onUpdateBoard}
                style={{
                  backgroundColor: '#e7b6cc',
                  borderRadius: 5,
                  width: 100,
                  borderWidth: 1,
                  borderColor: '#eee7da',
                  marginTop: 80,
                }}>
                <Text
                  style={{
                    color: '#0c0b09',
                    fontSize: 12,
                    fontWeight: '600',
                    margin: 10,
                    textAlign: 'center',
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {!updatedBool ? 'Submit' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
