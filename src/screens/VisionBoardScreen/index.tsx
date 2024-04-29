import {RouteProp, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Routes from '../../navigation/routes';
import {AppStackParams} from '../../navigation/types';
import Draggable from 'react-native-draggable';

interface IProps {
  navigation?: NativeStackNavigationProp<any, any>;
  route?: RouteProp<AppStackParams, Routes.visionBoardScreen>;
}

export const VisionBoardScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.visionBoardScreen>>();
  const backgroundPhoto = route.params.backgroundPhoto;
  const [showDraggable, setShowDraggable] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onPressOpenImagePicker = () => {
    setShowDraggable(!showDraggable);
    toggleModal();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        padding: 8,
        borderRadius: 5,
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
            renderSize={56}
            renderColor="black"
            renderText="A"
            imageSource={backgroundPhoto}
            shouldReverse
            onShortPressRelease={() => console.log('touched!!')}
          />
        )}
        <TouchableOpacity
          onPress={onPressOpenImagePicker}
          style={{
            backgroundColor: '#e7b6cc',
            borderRadius: 5,
            width: 100,
            borderWidth: 1,
            borderColor: '#eee7da',
            height: 50,
            alignSelf: 'flex-end',
            marginTop: screenHeight * 0.75,
            marginRight: 10,
          }}>
          <Text
            style={{
              color: '#0c0b09',
              marginTop: 10,
              textAlign: 'center',
              fontFamily: 'HighTide-Sans',
            }}>
            {'Open image picker'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
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
                {'Modal'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
