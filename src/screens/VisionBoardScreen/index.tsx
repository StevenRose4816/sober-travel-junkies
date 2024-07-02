import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {FC, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Routes from '../../navigation/routes';
import {AppStackParams, NavPropAny} from '../../navigation/types';
import {getDownloadURL, getStorage, ref as thisRef} from 'firebase/storage';
import {captureScreen} from 'react-native-view-shot';
import storage from '@react-native-firebase/storage';
import {useAppSelector} from '../../hooks';
import styles from './styles';
import PhotoDraggable from '../../components/PhotoDraggable';
import NoteDraggable from '../../components/NoteDraggable';
import VisionBoardModal from '../../components/VisionBoardModal';
import VisionBoardTouchableBar from '../../components/VisionBoardTouchableBar';

export const VisionBoardScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.visionBoardScreen>>();
  const navigation = useNavigation<NavPropAny>();
  const selectedImage = route?.params?.selectedImage || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [addNote, setAddNote] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [visibleNote, setVisibleNote] = useState('');
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [updatedBool, setUpdatedBool] = useState(false);
  const [screenShotUri, setScreenShotUri] = useState<string | undefined>(
    undefined,
  );
  const [hideToucables, setHideToucables] = useState(false);
  const [showSelectedImage, setShowSelectedImage] = useState(true);
  const [photoShortPressCount, setPhotoShortPressCount] = useState(0);
  const [stickyShortPressCount, setStickyShortPressCount] = useState(0);
  const [photoDragSize, setPhotoDragSize] = useState({width: 70, height: 70});
  const [stickyDragSize, setStickyDragSize] = useState({
    width: 120,
    height: 80,
  });
  const [stickySize, setStickySize] = useState({fontSize: 8, maxWidth: 40});
  const [showInitialPhotoDraggables, setShowInitialPhotoDraggables] =
    useState(false);
  const [showInitialStickyDraggables, setShowInitialStickyDraggables] =
    useState(false);
  const visionBoardFromState = useAppSelector(
    state => state.globalStore.visionBoardUrl,
  );
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(false);

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
              source={require('../../Images/caret_left.png')}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [hideToucables, navigation]);

  useEffect(() => {
    const initializeBoard = async () => {
      if (!visionBoardFromState) {
        setFirstLoad(true);
        await readFromStorage('visionBoardScreenShot');
      } else if (firstLoad || screenShotUri || !!visionBoardFromState) {
        setLoading(false);
      }
    };
    initializeBoard();
  }, [visionBoardFromState, screenShotUri, firstLoad]);

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
      await readFromStorage('visionBoardScreenShot');
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
    if (showInitialStickyDraggables) {
      toggleModal();
    } else if (!showInitialStickyDraggables) {
      setShowInitialStickyDraggables(true);
    }
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
      const url = await getDownloadURL(reference);
      setUrl(url);
    } catch (e) {
      console.error(e.message);
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
    setShowWelcomeModal(!showWelcomeModal);
  };

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ImageBackground
          style={styles.imageBackground1}
          source={
            !!screenShotUri
              ? {uri: screenShotUri}
              : !!visionBoardFromState
              ? {uri: visionBoardFromState}
              : require('../../Images/browntextured.jpg')
          }>
          {!hideToucables && (
            <View style={styles.view1}>
              <Text style={styles.text1}>Vision Board</Text>
            </View>
          )}
          {showInitialPhotoDraggables && (
            <PhotoDraggable
              hideToucables={hideToucables}
              onShortPressPhoto={onShortPressPhoto}
              photoDragSize={photoDragSize}
              showSelectedImage={showSelectedImage}
              selectedImage={selectedImage}
            />
          )}
          {addNote && showInitialStickyDraggables && (
            <NoteDraggable
              onShortPressSticky={onShortPressSticky}
              stickyDragSize={stickyDragSize}
              stickySize={stickySize}
              visibleNote={visibleNote}
            />
          )}
        </ImageBackground>
      )}
      {!hideToucables && (
        <VisionBoardTouchableBar
          hideToucables={hideToucables}
          onPressAddImage={onPressAddImage}
          onAddNote={onAddNote}
          setAddNote={setAddNote}
          addNote={addNote}
          onPressUpdateBoard={onPressUpdateBoard}
          setHideToucables={setHideToucables}
        />
      )}
      {modalVisible && (
        <VisionBoardModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          newNote={newNote}
          setNewNote={setNewNote}
          onSubmitNote={onSubmitNote}
          onPressCloseUpdateModal={onPressCloseUpdateModal}
          onUpdateBoard={onUpdateBoard}
          updatedBool={updatedBool}
        />
      )}
    </>
  );
};

export default VisionBoardScreen;
