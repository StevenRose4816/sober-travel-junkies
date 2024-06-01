import {Dispatch, FC, SetStateAction} from 'react';
import {Dimensions, Image, Modal, TouchableOpacity, View} from 'react-native';
import styles from './styles';

interface IPassedProps {
  isVisible: boolean;
  onRequestClose: () => void;
  setPhotoPressed: React.Dispatch<
    React.SetStateAction<{
      first: boolean;
      second: boolean;
      third: boolean;
      fourth: boolean;
    }>
  >;
  photoPressed: {
    first: boolean;
    second: boolean;
    third: boolean;
    fourth: boolean;
  };
}

const BackgroundPickerModal: FC<IPassedProps> = ({
  isVisible,
  onRequestClose,
  setPhotoPressed,
  photoPressed,
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
              <TouchableOpacity
                onPress={() =>
                  setPhotoPressed({
                    first: true,
                    second: false,
                    third: false,
                    fourth: false,
                  })
                }>
                <Image
                  style={
                    !photoPressed.first
                      ? styles.image
                      : [styles.image, {borderWidth: 5, borderColor: '#f86ca7'}]
                  }
                  source={require('../../Images/backgroundPhoto1.jpeg')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setPhotoPressed({
                    first: false,
                    second: true,
                    third: false,
                    fourth: false,
                  })
                }>
                <Image
                  style={
                    !photoPressed.second
                      ? styles.image
                      : [styles.image, {borderWidth: 5, borderColor: '#f86ca7'}]
                  }
                  source={require('../../Images/backgroundPhoto2.jpeg')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.imageRow}>
              <TouchableOpacity
                onPress={() =>
                  setPhotoPressed({
                    first: false,
                    second: false,
                    third: true,
                    fourth: false,
                  })
                }>
                <Image
                  style={
                    !photoPressed.third
                      ? styles.image
                      : [styles.image, {borderWidth: 5, borderColor: '#f86ca7'}]
                  }
                  source={require('../../Images/backgroundPhoto3.jpeg')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setPhotoPressed({
                    first: false,
                    second: false,
                    third: false,
                    fourth: true,
                  })
                }>
                <Image
                  style={
                    !photoPressed.fourth
                      ? styles.image
                      : [styles.image, {borderWidth: 5, borderColor: '#f86ca7'}]
                  }
                  source={require('../../Images/backgroundPhoto4.jpeg')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BackgroundPickerModal;
