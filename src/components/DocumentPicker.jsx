import {useState, useCallback} from 'react';
import {Text, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export const DocPicker = () => {
  const [fileResponse, setFileResponse] = useState([]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setFileResponse([response]);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      {fileResponse.map((file, index) => (
        <Text
          key={index.toString()}
          style={styles.uri}
          numberOfLines={1}
          ellipsizeMode={'middle'}>
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
