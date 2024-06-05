import {FC} from 'react';
import {View, Text, ImageBackground, Dimensions} from 'react-native';
import Draggable from 'react-native-draggable';
import styles from './styles';

interface IPassedProps {
  onShortPressSticky: () => void;
  stickyDragSize: {
    width: number;
    height: number;
  };
  stickySize: {
    fontSize: number;
    maxWidth: number;
  };
  visibleNote: string;
}

export const NoteDraggable: FC<IPassedProps> = ({
  onShortPressSticky,
  stickyDragSize,
  stickySize,
  visibleNote,
}) => {
  const screenWidth = Dimensions.get('window').width;
  return (
    <View>
      <Draggable
        x={screenWidth / 2 - 60}
        y={200}
        minX={0}
        minY={40}
        maxX={375}
        maxY={640}
        onShortPressRelease={onShortPressSticky}>
        <ImageBackground
          style={[
            styles.imageBackground,
            {
              width: stickyDragSize.width,
              height: stickyDragSize.height,
            },
          ]}
          source={require('../../Images/sticky.png')}
          resizeMode="stretch">
          <Text
            style={[
              styles.text,
              {
                fontSize: stickySize.fontSize,
                maxWidth: stickySize.maxWidth,
              },
            ]}>
            {visibleNote}
          </Text>
        </ImageBackground>
      </Draggable>
    </View>
  );
};

export default NoteDraggable;
