import {FC} from 'react';
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

interface IPassedProps {
  modalVisible: boolean;
  showWelcomeModal: boolean;
  toggleModal: () => void;
  onPressCloseUpdateModal: () => void;
  updatedBool: boolean;
  onSubmitNote: () => void;
  onPressIAgree: () => void;
  onUpdateBoard: () => void;
  newNote: string;
  setNewNote: (note: string) => void;
}

const VisionBoardModal: FC<IPassedProps> = ({
  modalVisible,
  showWelcomeModal,
  toggleModal,
  onPressCloseUpdateModal,
  updatedBool,
  onSubmitNote,
  onPressIAgree,
  onUpdateBoard,
  newNote,
  setNewNote,
}) => {
  return (
    <View>
      <Modal
        visible={modalVisible || showWelcomeModal}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.outerView}>
          <View style={styles.firstInnerView}>
            {!showWelcomeModal && (
              <TouchableOpacity
                onPress={onPressCloseUpdateModal}
                style={styles.closeTouchable}>
                <Image
                  style={styles.closeImage}
                  source={require('../../Images/close2.png')}
                />
              </TouchableOpacity>
            )}
            <View style={styles.touchableContainer}>
              {!updatedBool && !showWelcomeModal && (
                <>
                  <Text style={styles.noteText}>Add Note</Text>
                  <TextInput
                    value={newNote}
                    placeholder=" Note"
                    onChangeText={note => setNewNote(note)}
                    secureTextEntry={false}
                    style={styles.noteInput}></TextInput>
                </>
              )}
              {updatedBool && !showWelcomeModal && (
                <Text style={styles.updateText}>
                  Do you want to update the board?
                </Text>
              )}
              {showWelcomeModal && (
                <>
                  <Text style={styles.welcomeText}>
                    Welcome to the Vision Board.
                  </Text>
                  <Text style={styles.modalText}>
                    Post your vision for the trip, one image and/or note at a
                    time.{'\n\n'}
                    Don't completely cover someone else's post.{'\n\n'}
                    Please be respectful and have fun :)
                  </Text>
                </>
              )}
              <TouchableOpacity
                onPress={
                  !updatedBool && !showWelcomeModal
                    ? onSubmitNote
                    : showWelcomeModal
                    ? onPressIAgree
                    : onUpdateBoard
                }
                style={styles.variableInput}>
                <Text style={styles.variableText}>
                  {!updatedBool && !showWelcomeModal
                    ? 'Submit'
                    : showWelcomeModal
                    ? 'I agree.'
                    : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VisionBoardModal;
