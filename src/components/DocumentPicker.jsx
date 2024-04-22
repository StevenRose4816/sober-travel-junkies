import {useState, useCallback, useEffect} from 'react';
import {Text, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {setSelectedDocument} from '../store/document/slice';
import {useAppSelector} from '../hooks';
import {useDispatch} from 'react-redux';

export const DocPicker = ({toggleModal, toggleDocPickerSwitch}) => {
  const [fileResponse, setFileResponse] = useState([]);
  const documentSelected = useAppSelector(state => state.document.selected);
  const selectedDocumentFromState = useAppSelector(
    state => state.document.selectedDocument,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('documentSelected: ', documentSelected);
    console.log('selectedDocumentFromState: ', selectedDocumentFromState);
  }, [documentSelected, selectedDocumentFromState]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setFileResponse([response]);
      dispatch(setSelectedDocument({selectedDocument: [response]}));
      toggleModal();
      toggleDocPickerSwitch();
      console.log(fileResponse);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      {fileResponse.map((file, index) => (
        <Text key={index.toString()} numberOfLines={1} ellipsizeMode={'middle'}>
          {file?.uri}
        </Text>
      ))}
      <TouchableOpacity
        style={{
          minHeight: 50,
          justifyContent: 'center',
          borderRadius: 5,
        }}
        onPress={handleDocumentSelection}>
        <Text
          style={{
            fontFamily: 'HighTide-Sans',
            color: '#0c0b09',
            fontSize: 18,
            textAlign: 'center',
          }}>
          {'Select 📑'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
