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
}

interface Message {
  text: string;
  id: string;
  title?: string;
  name?: string;
  photo?: string;
  date?: string;
  time?: string;
  replies?: Message[];
}

const MessageBoardScreen: FC = () => {
  const userId = auth().currentUser?.uid as string;
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
  const formattedTime = date.toLocaleTimeString();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isReply, setIsReply] = useState(false);

  const flatListRef = useRef<FlatList>(null!);

  useEffect(() => {
    readData();
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
          time: formattedTime,
          replies: [],
        },
      ];
      setMessages(updatedMessages);
      await create(updatedMessages);
      setNewMessage('');
      onSetTitle(newTitle);
      readData();
      flatListRef.current && flatListRef.current.scrollToEnd();
    }
  };

  const onSendReply = async () => {
    if (newMessage.trim() !== '' && replyingTo) {
      const reply: Message = {
        text: newMessage,
        id: Math.random().toString(),
        name: fullName,
        photo: userPhotoFromDB,
        date: formattedDate,
        time: formattedTime,
      };
      const updatedMessages = messages.map(message =>
        message.id === replyingTo.id
          ? {...message, replies: [...(message.replies || []), reply]}
          : message,
      );
      setMessages(updatedMessages);
      await create(updatedMessages);
      setNewMessage('');
      setReplyingTo(null);
      readData();
      setIsReply(false);
      flatListRef.current.scrollToEnd();
    }
    console.log('Reply sent.');
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
    flatListRef.current?.scrollToEnd();
  };

  const onPressMessage = (item: Message) => {
    setReplyingTo(item);
    toggleModal();
  };

  const onPressYesSubmit = () => {
    toggleModal();
    setIsReply(true);
  };

  const renderItem = ({item}: {item: Message}) => (
    <>
      <View>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
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
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'HighTide-Sans',
                    opacity: 0.4,
                    marginBottom: 5,
                  }}>
                  {item.time}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'HighTide-Sans',
                    opacity: 0.6,
                  }}>
                  {item.date}
                </Text>
              </View>
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
        </TouchableOpacity>
      </View>
      {item.replies && item.replies.length > 0 && (
        <View>
          {item.replies.map(reply => (
            <TouchableOpacity onPress={() => onPressMessage(item)}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: '#d9d9d940',
                  padding: 8,
                  marginVertical: 8,
                  marginLeft: 30,
                  borderRadius: 8,
                }}>
                <Text style={{fontSize: 16, fontFamily: 'HighTide-Sans'}}>
                  {reply.title}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Vonique64',
                    marginBottom: 10,
                  }}>
                  {reply.text}
                </Text>
                <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'HighTide-Sans',
                        opacity: 0.4,
                        marginBottom: 5,
                      }}>
                      {reply.time}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'HighTide-Sans',
                        opacity: 0.6,
                      }}>
                      {reply.date}
                    </Text>
                  </View>
                  <View style={{alignItems: 'flex-end', flex: 1}}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        backgroundColor: '#b6e7cc60',
                        borderRadius: 8,
                        maxHeight: 40,
                      }}>
                      <Image
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 50,
                          margin: 5,
                          opacity: 0.7,
                        }}
                        source={
                          reply.photo
                            ? {uri: reply.photo}
                            : require('../../Images/profilepictureicon.png')
                        }></Image>
                      <Text
                        style={{
                          fontSize: 12,
                          marginLeft: 5,
                          marginRight: 5,
                          marginBottom: 5,
                          fontFamily: 'HighTide-Sans',
                          opacity: 0.7,
                        }}>
                        {'. . . ' + reply.name}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
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
          keyExtractor={item => `${item.id}-${item.date}`}
          renderItem={renderItem}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input2}
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
          onPress={!isReply ? onSend : onSendReply}>
          {!isReply ? (
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
          ) : (
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
              {'Reply'}
            </Text>
          )}
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
        <View style={styles.modalView1}>
          <View style={styles.modalView2}>
            <View style={styles.modalView3}>
              <Text
                style={{
                  color: '#eee7da',
                  fontSize: 21,
                  textAlign: 'center',
                  fontFamily: 'HighTide-Sans',
                }}>
                {'Reply?'}
              </Text>
            </View>
            <View style={styles.modalView4}>
              <TouchableOpacity
                onPress={onPressYesSubmit}
                style={{
                  marginTop: 20,
                  backgroundColor: 'blue',
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  width: 120,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#eee7da',
                    fontSize: 21,
                    backgroundColor: 'blue',
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Yes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleModal}
                style={{
                  marginTop: 20,
                  backgroundColor: 'blue',
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  width: 120,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#eee7da',
                    fontSize: 21,
                    backgroundColor: 'blue',
                    borderRadius: 5,
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'No'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    height: 90,
    justifyContent: 'flex-start',
    borderRadius: 8,
  },
  input: {
    height: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontFamily: 'HighTide-Sans',
  },
  input2: {
    height: 90,
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
    borderColor: '#0c0b09',
    backgroundColor: '#b6e7cc',
    minHeight: 300,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 20,
  },
  modalView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView2: {
    borderColor: '#0c0b09',
    backgroundColor: '#b6e7cc',
    minHeight: 300,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 20,
  },
  modalView3: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eee7da',
    borderWidth: 2,
  },
  modalView4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    fontFamily: 'HighTide-Sans',
  },
  text2: {
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    fontFamily: 'HighTide-Sans',
  },
});

export default MessageBoardScreen;
