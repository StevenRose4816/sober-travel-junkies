import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {FC, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
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
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {setVisionBoardUrl} from '../../store/globalStore/slice';
import Email from '../Email';

export const VisionBoardScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.visionBoardScreen>>();
  const navigation = useNavigation<NavPropAny>();
  const dispatch = useDispatch();
  const selectedImage = route?.params?.selectedImage || '';
  const newUser = useAppSelector(state => state.globalStore.newUser);
  const [modalVisible, setModalVisible] = useState(false);
  const [addNote, setAddNote] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [visibleNote, setVisibleNote] = useState('');
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [updatedBool, setUpdatedBool] = useState(false);
  const [screenShotUri, setScreenShotUri] = useState<string | undefined>(
    undefined,
  );
  const [hideTouchables, setHideTouchables] = useState(false);
  const [showSelectedImage, setShowSelectedImage] = useState(true);
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
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

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
      setHideTouchables(false);
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
    if (hideTouchables) {
      navigation.setOptions({
        headerLeft: () => null,
        headerRight: () => null,
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
        headerRight: () => (
          <Email
            subject="Report a Photo"
            recipients={[
              'steven_jangoh@yahoo.com',
              'mstevenrose9517@gmail.com',
            ]}
            body="Reporting VisionBoard Photo"
            touchableStyle={{
              backgroundColor: 'transparent',
              marginTop: 25,
            }}
            textStyle={{
              fontFamily: 'HighTide-Sans',
              opacity: 0.5,
              fontSize: 11,
            }}
            title="Report a Photo"
          />
        ),
      });
    }
  }, [hideTouchables, navigation]);

  useEffect(() => {
    if (!visionBoardFromState && !url) {
      console.log('read from DB');
      readFromStorage('visionBoardScreenShot');
    }
  }, [url, visionBoardFromState]);

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
    setHideTouchables(false);
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
    setHideTouchables(true);
    setUpdatedBool(true);
  };

  const readFromStorage = async (imageName: string) => {
    const storage = getStorage();
    const reference = thisRef(storage, imageName);
    try {
      await getDownloadURL(reference).then(url => {
        setUrl(url);
        dispatch(setVisionBoardUrl({visionBoardUrl: url}));
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const onShortPressPhoto = () => {
    if (photoShortPressCount < 4) {
      setPhotoDragSize({
        width: photoDragSize.width * 1.1,
        height: photoDragSize.width * 1.1,
      });
      setPhotoShortPressCount(prevCount => prevCount + 1);
    } else {
      setPhotoDragSize({width: 70, height: 70});
      setPhotoShortPressCount(0);
    }
  };

  const onShortPressSticky = () => {
    if (stickyShortPressCount < 4) {
      setStickyDragSize({
        width: stickyDragSize.width * 1.1,
        height: stickyDragSize.height * 1.1,
      });
      setStickyShortPressCount(prevCount => prevCount + 1);
      setStickySize({
        fontSize: stickySize.fontSize * 1.1,
        maxWidth: stickySize.maxWidth * 1.1,
      });
    } else {
      setStickyDragSize({width: 120, height: 80});
      setStickySize({fontSize: 8, maxWidth: 40});
      setStickyShortPressCount(0);
    }
  };

  const onPressIAgree = () => {
    setShowWelcomeModal(!showWelcomeModal);
  };

  const source = () => {
    if (!!screenShotUri) {
      return {uri: screenShotUri};
    } else if (!!visionBoardFromState) {
      return {uri: visionBoardFromState};
    } else {
      return require('../../Images/browntextured.jpg');
    }
  };

  return (
    <>
      <FastImage
        style={styles.imageBackground1}
        source={source()}
        resizeMode={FastImage.resizeMode.cover}>
        {!hideTouchables ? (
          <View style={styles.view1}>
            <Text style={styles.text1}>Vision Board</Text>
          </View>
        ) : (
          <View style={styles.view1}>
            <Text style={styles.text1}></Text>
          </View>
        )}
        {showInitialPhotoDraggables && (
          <PhotoDraggable
            hideTouchables={hideTouchables}
            onShortPressPhoto={onShortPressPhoto}
            photoDragSize={photoDragSize}
            showSelectedImage={showSelectedImage}
            selectedImage={selectedImage}
            setShowInitialPhotoDraggables={setShowInitialPhotoDraggables}
            setHideTouchables={setHideTouchables}
          />
        )}
        {addNote && showInitialStickyDraggables && (
          <NoteDraggable
            onShortPressSticky={onShortPressSticky}
            stickyDragSize={stickyDragSize}
            stickySize={stickySize}
            visibleNote={visibleNote}
            hideTouchables={hideTouchables}
            showInitialStickyDraggables={showInitialStickyDraggables}
            setShowInitialStickyDraggables={setShowInitialStickyDraggables}
          />
        )}
      </FastImage>
      {!hideTouchables && (
        <VisionBoardTouchableBar
          showInitialPhotoDraggables={showInitialPhotoDraggables}
          showInitialStickyDraggables={showInitialStickyDraggables}
          onPressOpenImagePicker={onPressOpenImagePicker}
          onPressAddImage={onPressAddImage}
          onPressUpdateBoard={onPressUpdateBoard}
          onAddNote={onAddNote}
        />
      )}
      <VisionBoardModal
        navigation={navigation}
        modalVisible={modalVisible}
        showWelcomeModal={showWelcomeModal}
        toggleModal={toggleModal}
        onPressCloseUpdateModal={onPressCloseUpdateModal}
        updatedBool={updatedBool}
        onSubmitNote={onSubmitNote}
        onPressIAgree={onPressIAgree}
        onUpdateBoard={onUpdateBoard}
        newNote={newNote}
        setNewNote={setNewNote}
      />
    </>
  );
};
