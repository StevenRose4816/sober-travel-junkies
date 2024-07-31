import {Dispatch, FC, SetStateAction} from 'react';
import {View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Draggable from 'react-native-draggable';
import styles from './styles';

interface IPassedProps {
  hideTouchables: boolean;
  setHideTouchables: Dispatch<SetStateAction<boolean>>;
  onShortPressPhoto: () => void;
  photoDragSize: {
    width: number;
    height: number;
  };
  showSelectedImage: boolean;
  selectedImage?: string;
  setShowInitialPhotoDraggables: Dispatch<SetStateAction<boolean>>;
}

const PhotoDraggable: FC<IPassedProps> = ({
  hideTouchables,
  onShortPressPhoto,
  photoDragSize,
  showSelectedImage,
  selectedImage,
  setShowInitialPhotoDraggables,
  setHideTouchables,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const source =
    showSelectedImage && selectedImage
      ? {uri: selectedImage}
      : require('../../Images/camerapictureicon.png');
  return (
    <View>
      <Draggable
        x={screenWidth / 2 - 30}
        y={100}
        minX={0}
        minY={0}
        maxX={400}
        maxY={screenHeight * 0.73}
        renderColor={'transparent'}
        isCircle
        onShortPressRelease={onShortPressPhoto}>
        <View>
          {!hideTouchables ? (
            <TouchableOpacity
              onPress={() => {
                setShowInitialPhotoDraggables(false);
              }}
              style={styles.closeTouchable}>
              <Image
                style={styles.closeIcon}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.closeTouchable, {height: 25}]}></TouchableOpacity>
          )}
          <Image
            style={
              (styles.image,
              {width: photoDragSize.width, height: photoDragSize.height})
            }
            source={source}
            resizeMode="stretch"></Image>
        </View>
      </Draggable>
    </View>
  );
};

export default PhotoDraggable;
