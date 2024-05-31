import {FC} from 'react';
import {Image, Modal, TouchableOpacity, View} from 'react-native';
import {DocPicker} from '../../DocumentPicker';

interface IPassedProps {
  isVisible: boolean;
  onRequestClose: () => void;
}

const DocumentPickerModal: FC<IPassedProps> = ({isVisible, onRequestClose}) => {
  return (
    <Modal
      visible={isVisible}
      animationType={'slide'}
      transparent={true}
      onRequestClose={onRequestClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            borderColor: '#0c0b09',
            backgroundColor: '#b6e7cc',
            minHeight: 300,
            width: '80%',
            justifyContent: 'center',
            borderRadius: 5,
            padding: 20,
          }}>
          <TouchableOpacity
            onPress={onRequestClose}
            style={{alignSelf: 'flex-end'}}>
            <Image
              style={{height: 25, width: 25}}
              source={require('../../../Images/close2.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <DocPicker />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DocumentPickerModal;
