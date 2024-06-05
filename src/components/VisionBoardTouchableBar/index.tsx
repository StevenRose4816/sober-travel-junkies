import {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';

interface IPassedProps {
  showInitialPhotoDraggables: boolean;
  showInitialStickyDraggables: boolean;
  onPressOpenImagePicker: () => void;
  onPressAddImage: () => void;
  onPressUpdateBoard: () => void;
  onAddNote: () => void;
}

const VisionBoardTouchableBar: FC<IPassedProps> = ({
  showInitialPhotoDraggables,
  showInitialStickyDraggables,
  onPressOpenImagePicker,
  onPressAddImage,
  onPressUpdateBoard,
  onAddNote,
}) => {
  return (
    <View style={styles.containerView}>
      <TouchableOpacity
        onPress={
          showInitialPhotoDraggables ? onPressOpenImagePicker : onPressAddImage
        }
        style={styles.imageTouchable}>
        <Text style={styles.touchableText}>
          {!showInitialPhotoDraggables ? 'Add Image' : 'Open Image Picker'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressUpdateBoard}
        style={styles.touchableUpdate}>
        <Text style={styles.updateText}>Update Board</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onAddNote} style={styles.noteTouchable}>
        <Text style={styles.noteText}>
          {!showInitialStickyDraggables ? 'Add Note' : 'Write Note'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VisionBoardTouchableBar;
