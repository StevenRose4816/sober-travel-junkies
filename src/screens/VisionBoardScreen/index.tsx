import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Routes from '../../navigation/routes';
import {AppStackParams, NavPropAny} from '../../navigation/types';
import Draggable from 'react-native-draggable';
import {vi} from 'date-fns/locale/vi';

interface IProps {
  navigation?: NativeStackNavigationProp<any, any>;
  route?: RouteProp<AppStackParams, Routes.visionBoardScreen>;
}

export const VisionBoardScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.visionBoardScreen>>();
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const backgroundPhoto = route.params.backgroundPhoto;
  const selectedImage = route.params.selectedImage;
  const [showDraggable, setShowDraggable] = useState(true);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);
  const [addNote, setAddNote] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [visibleNote, setVisibleNote] = useState('');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onPressOpenImagePicker = () => {
    navigation.navigate('imagePicker');
    // setShowDraggable(!showDraggable);
    // toggleModal();
  };

  useEffect(() => {
    console.log('selectedimage: ', selectedImage);
    console.log('backgroundPhoto: ', backgroundPhoto);
  }, [selectedImage, backgroundPhoto]);

  const onAddNote = () => {
    // setAddNote(!addNote);
    toggleModal();
  };

  const onSubmitNote = () => {
    setVisibleNote(newNote);
    toggleModal();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        padding: 8,
        borderRadius: 5,
        position: 'relative',
      }}>
      <ImageBackground
        style={{flex: 1}}
        imageStyle={{opacity: 0.3}}
        source={backgroundPhoto}>
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
        {showDraggable && (
          <Draggable
            x={100}
            y={100}
            minX={0}
            minY={40}
            maxX={375}
            maxY={640}
            renderColor="#fb445c"
            renderText="A"
            isCircle
            onShortPressRelease={() => console.log('touched!!')}>
            <Image
              style={{height: 50, width: 50}}
              source={
                selectedImage
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
            x={200}
            y={100}
            minX={0}
            minY={40}
            maxX={375}
            maxY={640}
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
            Open image picker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log('save snapshot')}
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
            Save snapshot
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
              onPress={toggleModal}
              style={{alignSelf: 'flex-end'}}>
              <Image
                style={{height: 25, width: 25}}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
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
              <TouchableOpacity
                onPress={onSubmitNote}
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
                  {'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
