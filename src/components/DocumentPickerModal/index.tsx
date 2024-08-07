import {FC} from 'react';
import {Image, Modal, TouchableOpacity, View} from 'react-native';
import {DocPicker} from '../DocumentPicker';
import styles from './styles';

interface IPassedProps {
  isVisible: boolean;
  onRequestClose: () => void;
  uploadDocument(): any;
}

const DocumentPickerModal: FC<IPassedProps> = ({
  isVisible,
  onRequestClose,
  uploadDocument,
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType={'slide'}
      transparent={true}
      onRequestClose={onRequestClose}>
      <View style={styles.containerView}>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            onPress={onRequestClose}
            style={styles.closeTouchable}>
            <Image
              style={styles.closeIcon}
              source={require('../../Images/close2.png')}
            />
          </TouchableOpacity>
          <View style={styles.docPickerContainer}>
            <DocPicker upload={uploadDocument} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DocumentPickerModal;
