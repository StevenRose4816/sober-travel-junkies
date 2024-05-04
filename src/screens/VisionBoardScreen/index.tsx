import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
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
import {useAppSelector} from '../../hooks';
import styles from './styles';

export const VisionBoardScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.visionBoardScreen>>();
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const {selectedImage} = route.params;
  const [showDraggable, setShowDraggable] = useState(true);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);
  const [addNote, setAddNote] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [visibleNote, setVisibleNote] = useState('');
  const [photoDragPosition, setPhotoDragPosition] = useState({
    x: screenWidth / 2 - 30,
    y: 100,
    pageX: 0,
    pageY: 0,
  });
  const [stickyDragPosition, setStickyDragPosition] = useState({
    x: screenWidth / 2 - 60,
    y: 200,
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
  const visionBoardFromState = useAppSelector(
    state => state.globalStore.visionBoardUrl,
  );
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

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
            style={styles.touchable1}>
            <Image
              style={styles.image1}
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
      console.log('Vision Board has updated in Firebase Cloud Storage.');
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
      const newFontSize = stickySize.fontSize * 1.1;
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

  const onPressIAgree = () => {
    console.log('pressed');
    setShowWelcomeModal(!showWelcomeModal);
  };

  return (
    <>
      <ImageBackground
        style={styles.imageBackground1}
        source={
          screenShotUri !== ''
            ? {uri: screenShotUri}
            : url !== ''
            ? {url}
            : require('../../Images/browntextured.jpg')
        }>
        {!hideToucables && (
          <View style={styles.view1}>
            <Text style={styles.text1}>Vision Board</Text>
          </View>
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
              style={[
                styles.image2,
                {
                  width: photoDragSize.width,
                  height: photoDragSize.height,
                },
              ]}
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
              style={[
                styles.imageBackground2,
                {
                  width: stickyDragSize.width,
                  height: stickyDragSize.height,
                },
              ]}
              source={require('../../Images/sticky.png')}
              resizeMode="stretch">
              <Text
                style={[
                  styles.text2,
                  {
                    fontSize: stickySize.fontSize,
                    maxWidth: stickySize.maxWidth,
                  },
                ]}>
                {visibleNote}
              </Text>
            </ImageBackground>
          </Draggable>
        )}
      </ImageBackground>
      {!hideToucables && (
        <View style={styles.view2}>
          <TouchableOpacity
            onPress={
              showInitialPhotoDraggables
                ? onPressOpenImagePicker
                : onPressAddImage
            }
            style={styles.touchable2}>
            <Text style={styles.text3}>
              {!showInitialPhotoDraggables ? 'Add Image' : 'Open Image Picker'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressUpdateBoard}
            style={styles.touchable3}>
            <Text style={styles.text4}>Update Board</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAddNote} style={styles.touchable4}>
            <Text style={styles.text5}>
              {!showInitialStickyDraggables ? 'Add Note' : 'Write Note'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={modalVisible || showWelcomeModal}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.view3}>
          <View style={styles.view4}>
            {!showWelcomeModal && (
              <TouchableOpacity
                onPress={onPressCloseUpdateModal}
                style={styles.touchable5}>
                <Image
                  style={styles.image3}
                  source={require('../../Images/close2.png')}
                />
              </TouchableOpacity>
            )}
            <View style={styles.view5}>
              {!updatedBool && !showWelcomeModal && (
                <>
                  <Text style={styles.text6}>Add Note</Text>
                  <TextInput
                    value={newNote}
                    placeholder=" Note"
                    onChangeText={note => setNewNote(note)}
                    secureTextEntry={false}
                    style={styles.textInput1}></TextInput>
                </>
              )}
              {updatedBool && !showWelcomeModal && (
                <Text style={styles.text7}>
                  Do you want to update the board?
                </Text>
              )}
              {showWelcomeModal && (
                <>
                  <Text style={styles.text8}>Welcome to the Vision Board.</Text>
                  <Text style={styles.text9}>
                    Post your vision for the trip, one image and/or note at a
                    time.{'\n\n'}
                    Don't completely cover someone else's post.{'\n\n'}
                    Please be respectful and have fun :)
                  </Text>
                </>
              )}
              <TouchableOpacity
                onPress={
                  !updatedBool && !showWelcomeModal
                    ? onSubmitNote
                    : showWelcomeModal
                    ? onPressIAgree
                    : onUpdateBoard
                }
                style={styles.textInput2}>
                <Text style={styles.text10}>
                  {!updatedBool && !showWelcomeModal
                    ? 'Submit'
                    : showWelcomeModal
                    ? 'I agree.'
                    : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
