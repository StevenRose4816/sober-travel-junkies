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
  //   const [] = useState('');

  useEffect(() => {
    readData();
    console.log('Messages in db: ', messages);
  }, []);

  const create = async (userId: string | undefined, messages: any) => {
    await set(ref(db, 'messages/' + userId), {messages});
    console.log('db created/updated');
  };

  const readData = async () => {
    const countRef = ref(db, 'messages/' + userId);
    try {
      const snapshot = await get(countRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Data: ', data);
        setMessages(data.messages);
        console.log('Messages: ', messages);
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
      await create(userId, updatedMessages);
    }
  };

  return (
    <View style={styles.container}>
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
          onChangeText={text => setNewMessage(text)}
        />
        <Button title="Send" onPress={addMessage} />
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
    flexDirection: 'row',
    alignItems: 'center',
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
