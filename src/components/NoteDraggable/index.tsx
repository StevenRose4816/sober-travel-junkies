import {Dispatch, FC, SetStateAction} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
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
  hideTouchables: boolean;
  showInitialStickyDraggables: boolean;
  setShowInitialStickyDraggables: Dispatch<SetStateAction<boolean>>;
}

export const NoteDraggable: FC<IPassedProps> = ({
  onShortPressSticky,
  stickyDragSize,
  stickySize,
  visibleNote,
  hideTouchables,
  setShowInitialStickyDraggables,
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
        <View>
          {!hideTouchables && (
            <TouchableOpacity
              onPress={() => {
                setShowInitialStickyDraggables(false);
              }}
              style={styles.closeTouchable}>
              <Image
                style={styles.closeIcon}
                source={require('../../Images/close2.png')}
              />
            </TouchableOpacity>
          )}
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
        </View>
      </Draggable>
    </View>
  );
};

export default NoteDraggable;
