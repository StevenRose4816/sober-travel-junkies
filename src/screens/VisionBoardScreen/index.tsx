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
import {firebase} from '@react-native-firebase/firestore';
import {getDownloadURL, getStorage, ref as thisRef} from 'firebase/storage';
import auth from '@react-native-firebase/auth';
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
  const [photoDragPosition2, setPhotoDragPosition2] = useState({
    x: 100,
    y: 100,
    pageX: 0,
    pageY: 0,
  });
  const [stickyDragPosition2, setStickyDragPosition2] = useState({
    x: 200,
    y: 100,
    pageX: 0,
    pageY: 0,
  });
  const [vBData, setVBData] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const userId = auth().currentUser?.uid;
  const [modalVisible2, setModalVisible2] = useState(false);
  const [updatedBool, setUpdatedBool] = useState(false);
  const [screenShotUri, setScreenShotUri] = useState('');
  const [hideToucables, setHideToucables] = useState(false);
  const [showSelectedImage, setShowSelectedImage] = useState(true);
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];

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
    } catch (e) {
      console.error(e);
    }
  };

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

      await uploadImage(uri); // Upload the captured image
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
    console.log('selectedimage: ', selectedImage);
    console.log('backgroundPhoto: ', backgroundPhoto);
  }, [selectedImage, backgroundPhoto]);

  useEffect(() => {
    readFromStorage('visionBoardScreenShot');
  }, [screenShotUri]);

  //   const handlePhotoDragRelease = (e: any, gesture: any) => {
  //     console.log(
  //       'pageX, pageY = ' + e.nativeEvent.pageX + ', ' + e.nativeEvent.pageY,
  //     );
  //     console.log(
  //       'locX, locY = ' +
  //         e.nativeEvent.locationX +
  //         ', ' +
  //         e.nativeEvent.locationY,
  //     );
  //     setPhotoDragPosition2({
  //       x: e.nativeEvent.pageX,
  //       y: e.nativeEvent.pageY,
  //       pageX: e.nativeEvent.pageX,
  //       pageY: e.nativeEvent.pageY,
  //     });
  //   };

  //   const handleStickyDragRelease = (e: any, gesture: any) => {
  //     console.log(
  //       'pageX, pageY = ' + e.nativeEvent.pageX + ', ' + e.nativeEvent.pageY,
  //     );
  //     console.log(
  //       'locX, locY = ' +
  //         e.nativeEvent.locationX +
  //         ', ' +
  //         e.nativeEvent.locationY,
  //     );
  //     setStickyDragPosition2({
  //       x: e.nativeEvent.pageX,
  //       y: e.nativeEvent.pageY,
  //       pageX: e.nativeEvent.pageX,
  //       pageY: e.nativeEvent.pageY,
  //     });
  //   };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onPressCloseUpdateModal = () => {
    toggleModal();
    setUpdatedBool(false);
  };

  const onPressOpenImagePicker = () => {
    setShowSelectedImage(true);
    navigation.navigate('imagePicker');
  };

  const onAddNote = () => {
    toggleModal();
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

  //   const writeDataToFirestore = async (
  //     collection: string,
  //     data: any,
  //     docId: string,
  //   ) => {
  //     try {
  //       const ref = firebase.firestore().collection(collection).doc(docId);
  //       const response = await ref.set({data});
  //       return response;
  //     } catch (error) {
  //       console.log('error: ', error);
  //       return error;
  //     }
  //   };

  //   const readVBDataFromFirestore = async (collection: string, docId: string) => {
  //     try {
  //       const ref = firebase.firestore().collection(collection).doc(docId);
  //       const response = await ref.get();
  //       const data = response.data(); // Extract data from DocumentSnapshot
  //       if (data && Array.isArray(data.data)) {
  //         const extractedData = data.data;
  //         console.log('Extracted data:', extractedData);
  //         return extractedData;
  //       } else {
  //         console.log('No data available or invalid format');
  //         return [];
  //       }
  //     } catch (error) {
  //       console.error('Error reading data from Firestore:', error);
  //       return error;
  //     }
  //   };

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

  return (
    <>
      <ImageBackground
        style={{flex: 1}}
        source={
          screenShotUri
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
        {showDraggable && (
          <Draggable
            x={photoDragPosition.x}
            y={photoDragPosition.y}
            minX={0}
            minY={40}
            maxX={375}
            maxY={640}
            renderColor="#fb445c"
            renderText="A"
            isCircle
            // onDragRelease={(event, gesture) =>
            //   handlePhotoDragRelease(event, gesture)
            // }
            onShortPressRelease={() => console.log('touched!!')}>
            <Image
              style={{height: 50, width: 50}}
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
        {addNote && (
          <Draggable
            x={stickyDragPosition.x}
            y={stickyDragPosition.y}
            minX={0}
            minY={40}
            maxX={375}
            maxY={640}
            // onDragRelease={(event, gesture) =>
            //   handleStickyDragRelease(event, gesture)
            // }
            onShortPressRelease={() => console.log('touched!!')}>
            <ImageBackground
              style={{
                height: 60,
                width: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../../Images/sticky.png')}
              resizeMode="stretch">
              <Text
                style={{
                  fontFamily: 'HighTide-Sans',
                  fontSize: 8,
                  maxWidth: 40,
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
            onPress={onPressOpenImagePicker}
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
              Add Image
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
              Add Note
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
