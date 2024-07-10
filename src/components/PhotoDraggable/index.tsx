import {Dispatch, FC, SetStateAction} from 'react';
import {View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Draggable from 'react-native-draggable';
import styles from './styles';

interface IPassedProps {
  hideToucables: boolean;
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
  hideToucables,
  onShortPressPhoto,
  photoDragSize,
  showSelectedImage,
  selectedImage,
  setShowInitialPhotoDraggables,
  setHideTouchables,
}) => {
  const screenWidth = Dimensions.get('window').width;
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
        minY={40}
        maxX={375}
        maxY={640}
        renderColor={'transparent'}
        isCircle
        onShortPressRelease={onShortPressPhoto}>
        {!hideToucables && (
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
        )}
        <Image
          style={
            (styles.image,
            {width: photoDragSize.width, height: photoDragSize.height})
          }
          source={source}
          resizeMode="stretch"></Image>
      </Draggable>
    </View>
  );
};

export default PhotoDraggable;
