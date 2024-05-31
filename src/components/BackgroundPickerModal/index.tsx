import {FC} from 'react';
import {Dimensions, Image, Modal, TouchableOpacity, View} from 'react-native';
import styles from './styles';

interface IPassedProps {
  isVisible: boolean;
  onRequestClose: () => void;
}

const BackgroundPickerModal: FC<IPassedProps> = ({
  isVisible,
  onRequestClose,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
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
          <View style={styles.imageGrid}>
            <View style={styles.imageRow}>
              <Image
                style={styles.image}
                source={require('../../Images/backgroundPhoto1.jpeg')}
              />
              <Image
                style={styles.image}
                source={require('../../Images/backgroundPhoto2.jpeg')}
              />
            </View>
            <View style={styles.imageRow}>
              <Image
                style={styles.image}
                source={require('../../Images/backgroundPhoto3.jpeg')}
              />
              <Image
                style={styles.image}
                source={require('../../Images/backgroundPhoto4.jpeg')}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BackgroundPickerModal;
