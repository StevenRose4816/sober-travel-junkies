import {FC} from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import Draggable from 'react-native-draggable';
import styles from './styles';

interface IPassedProps {
  hideToucables: boolean;
  onShortPressPhoto: () => void;
  photoDragSize: {
    width: number;
    height: number;
  };
  showSelectedImage: boolean;
  selectedImage?: string;
}

const PhotoDraggable: FC<IPassedProps> = ({
  hideToucables,
  onShortPressPhoto,
  photoDragSize,
  showSelectedImage,
  selectedImage,
}) => {
  const screenWidth = Dimensions.get('window').width;
  return (
    <View>
      <Draggable
        x={screenWidth / 2 - 30}
        y={100}
        minX={0}
        minY={40}
        maxX={375}
        maxY={640}
        renderColor={hideToucables ? '#fb445c00' : '#fb445c'}
        isCircle
        onShortPressRelease={onShortPressPhoto}>
        <Image
          style={[
            styles.image,
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
    </View>
  );
};

export default PhotoDraggable;
