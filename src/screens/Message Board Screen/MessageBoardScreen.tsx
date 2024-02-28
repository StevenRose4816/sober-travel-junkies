import React, {FC, useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  Image,
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
  const [postedTitle, setPostedTitle] = useState<string>('');

  useEffect(() => {
    readData();
    console.log('Messages in db: ', messages);
  }, []);

  const create = async (messages: any) => {
    await set(ref(db, 'messages/'), {messages});
    console.log('db created/updated');
  };

  const readData = async () => {
    const countRef = ref(db, 'messages/');
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Data: ', data);
        setMessages(data.messages);
        console.log('First Message: ', data.messages[0].text);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading data from the database:', error);
    }
  };

  const addMessage = async () => {
    if (newMessage.trim() !== '') {
      const updatedMessages = [
        ...messages,
        {text: newMessage, id: Math.random().toString()},
      ];
      setMessages(updatedMessages);
      await create(updatedMessages);
      setNewMessage('');
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

  return (
    <View style={styles.container}>
      {postedTitle && (
        <View>
          <Text>{'Test'}</Text>
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
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={newMessage => setNewMessage(newMessage)}
        />
        <Button title="Send" onPress={addMessage} />
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newTitle}
          onChangeText={title => setNewTitle(title)}
        />
        <Button title="Set Title" onPress={() => onSetTitle(newTitle)} />
      </View>
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
    height: 200,
    justifyContent: 'flex-start',
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});

export default MessageBoardScreen;
