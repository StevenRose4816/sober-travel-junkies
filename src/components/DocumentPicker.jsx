import {useState, useCallback, useEffect} from 'react';
import {Text, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {setDocumentSelected} from '../store/document/slice';
import {useAppSelector} from '../hooks';
import {useDispatch} from 'react-redux';
import {documentId} from 'firebase/firestore';

export const DocPicker = () => {
  const [fileResponse, setFileResponse] = useState([]);
  const documentSelected = useAppSelector(state => state.document.selected);
  const dispatch = useDispatch();

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setFileResponse([response]);
      dispatch(setDocumentSelected({selected: true}));
      console.log('documentSelected: ', documentSelected);
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
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          {'Select 📑'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
