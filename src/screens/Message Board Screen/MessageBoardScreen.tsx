import React, {FC, useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {get, onValue, ref, set} from 'firebase/database';
import {db} from '../HomeScreen/FirebaseConfigurations';

interface Message {
  text: string;
  id: string;
}

const MessageBoardScreen: FC = () => {
  const userId = auth().currentUser?.uid;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [titlefromDB, setTitlefromDB] = useState<string>('');
  const [postedTitle, setPostedTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    readData();
    console.log('Messages in db: ', messages);
  }, []);

  const create = async (messages: any, title: any) => {
    await set(ref(db, 'messages/'), {messages, title});
    console.log('db created/updated');
  };

  const readData = async () => {
    const countRef = ref(db, 'messages/');
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Data: ', data);
        setTitlefromDB(data.title);
        setMessages(data.messages);
        console.log('First Message: ', data.messages[0].text);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading data from the database:', error);
    }
  };

  const onSend = async () => {
    if (newMessage.trim() !== '') {
      const updatedMessages = [
        ...messages,
        {text: newMessage, id: Math.random().toString()},
      ];
      setMessages(updatedMessages);
      await create(updatedMessages, newTitle);
      setNewMessage('');
      onSetTitle(newTitle);
      toggleModal();
    }
  };

  const onSetTitle = (title: string) => {
    if (newTitle.trim() !== '') {
      setPostedTitle(title);
      setNewTitle('');
      console.log('New Title: ', newTitle);
      console.log('Posted Title: ', postedTitle);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 10,
          }}>
          {'Messages'}
        </Text>
      </View>
      {postedTitle && (
        <View>
          <Text>{postedTitle}</Text>
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Set the title of your message..."
          value={newTitle}
          onChangeText={title => setNewTitle(title)}
        />
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={newMessage => setNewMessage(newMessage)}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#b6e7cc',
            borderRadius: 5,
            width: 100,
            borderWidth: 1,
            borderColor: '#eee7da',
          }}
          onPress={onSend}>
          <Text
            style={{
              color: '#0c0b09',
              fontSize: 12,
              fontWeight: '600',
              marginBottom: 10,
              marginTop: 10,
              marginRight: 10,
              marginLeft: 10,
              textAlign: 'center',
              fontFamily: 'HighTide-Sans',
            }}>
            {'Send'}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType={'slide'}
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.modalView5}>
          <TouchableOpacity onPress={toggleModal}>
            <View style={styles.modalView6}>
              <Text>{'Modal'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: '#eee7da',
    height: 150,
    justifyContent: 'flex-start',
    borderRadius: 5,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  modalView5: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView6: {
    backgroundColor: '#b6e7cc',
    height: 300,
    width: 300,
    borderRadius: 5,
  },
});

export default MessageBoardScreen;