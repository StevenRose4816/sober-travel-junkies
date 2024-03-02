import React, {FC, useEffect, useRef, useState} from 'react';
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
import {useRoute} from '@react-navigation/native';

interface RouteParams {
  fullName?: string;
  userPhotoFromDB?: string;
  formattedDate?: string;
}

interface Message {
  text: string;
  id: string;
  title?: string;
  name?: string;
  photo?: string;
  date?: string;
}

const MessageBoardScreen: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [postedTitle, setPostedTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(false);
  const route = useRoute();
  const {fullName}: RouteParams = route.params || {};
  const {userPhotoFromDB}: RouteParams = route.params || {};
  const screenWidth = Dimensions.get('window').width;
  const date = new Date();
  const formattedDate = date.toDateString();

  const flatListRef = useRef<FlatList>(null!);

  useEffect(() => {
    readData();
    console.log('Messages in db: ', messages);
    console.log('FullName: ', fullName);
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
        setData(true);
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
        {
          text: newMessage,
          id: Math.random().toString(),
          title: newTitle,
          name: fullName,
          photo: userPhotoFromDB,
          date: formattedDate,
        },
      ];
      setMessages(updatedMessages);
      await create(updatedMessages);
      setNewMessage('');
      onSetTitle(newTitle);
      readData();
      flatListRef.current.scrollToEnd();
    }
  };

  const onSetTitle = (title: string) => {
    if (newTitle.trim() !== '') {
      setPostedTitle(title);
      setNewTitle('');
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onPressScroll = () => {
    flatListRef.current.scrollToEnd();
  };

  const renderItem = ({item}: {item: Message}) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#e0e0e0',
        padding: 8,
        marginVertical: 8,
        borderRadius: 8,
      }}>
      <Text style={{fontSize: 16, fontFamily: 'HighTide-Sans'}}>
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Vonique64',
          marginBottom: 10,
        }}>
        {item.text}
      </Text>
      <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
        <Text style={{fontSize: 12, fontFamily: 'HighTide-Sans', opacity: 0.5}}>
          {item.date}
        </Text>

        <View style={{alignItems: 'flex-end', flex: 1}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'baseline',
              backgroundColor: '#b6e7cc',
              borderRadius: 8,
              maxHeight: 40,
            }}>
            <Image
              style={{
                height: 30,
                width: 30,
                borderRadius: 50,
                margin: 5,
              }}
              source={
                item.photo
                  ? {uri: item.photo}
                  : require('../../Images/profilepictureicon.png')
              }></Image>
            <Text
              style={{
                fontSize: 12,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 5,
                fontFamily: 'HighTide-Sans',
              }}>
              {'. . . ' + item.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        padding: 16,
        borderColor: '#b6e7cc',
        borderWidth: 3,
        borderRadius: 5,
      }}>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 10,
          fontFamily: 'HighTide-Sans',
        }}>
        {'Message Board'}
      </Text>
      {data && (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
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
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#b6e7cc',
            borderRadius: 5,
            width: 100,
            borderWidth: 1,
            marginTop: 10,
            borderColor: '#eee7da',
          }}
          onPress={onSend}>
          <Text
            style={{
              color: '#0c0b09',
              fontSize: 12,
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
              marginBottom: 15,
              fontFamily: 'HighTide-Sans',
            }}>
            {'Send'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#b6e7cc',
            borderRadius: 5,
            width: 100,
            borderWidth: 1,
            marginTop: 10,
            borderColor: '#eee7da',
          }}
          onPress={onPressScroll}>
          <Text
            style={{
              color: '#0c0b09',
              fontSize: 12,
              marginBottom: 10,
              marginTop: 10,
              marginRight: 10,
              marginLeft: 10,
              textAlign: 'center',
              fontFamily: 'HighTide-Sans',
            }}>
            {'Scroll to bottom'}
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
    borderColor: '#b6e7cc',
    borderWidth: 3,
    borderRadius: 5,
  },
  messageContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#e0e0e0',
    padding: 5,
    marginVertical: 8,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: '#eee7da',
    height: 100,
    justifyContent: 'flex-start',
    borderRadius: 8,
  },
  input: {
    height: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontFamily: 'HighTide-Sans',
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
