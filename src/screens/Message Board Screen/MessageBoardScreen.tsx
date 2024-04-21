import React, {FC, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {get, onValue, ref, set} from 'firebase/database';
import {db} from '../HomeScreen/FirebaseConfigurations';
import {RouteProp} from '@react-navigation/native';
import {useAppSelector} from '../../hooks';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParams} from '../../navigation/types';
import Routes from '../../navigation/routes';

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

interface IProps {
  navigation?: NativeStackNavigationProp<any, any>;
  route?: RouteProp<AppStackParams, Routes.messageBoardScreen>;
}

const MessageBoardScreen: FC<IProps> = ({route}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(false);
  const [dataObj, setDataObj] = useState('');
  const userPhotoFromDB = route?.params.userPhotoFromDB;
  const fullName = route?.params.fullName;
  const backgroundPhoto = route?.params.backgroundPhoto;
  const date = new Date();
  const formattedDate = date.toDateString();
  const formattedTime = date.toLocaleTimeString();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isReply, setIsReply] = useState(false);
  const [showReplies, setShowReplies] = useState<string[]>([]);
  const bgPhoto = useAppSelector(state => state.user.uri);
  console.log('bgPhoto: ', bgPhoto);
  console.log('backgroundPhoto: ', backgroundPhoto);

  const flatListRef = useRef<FlatList>(null!);

  useEffect(() => {
    readData();
  }, []);

  const create = async (messages: Message[]) => {
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
        setDataObj(data);
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
      flatListRef.current?.scrollToEnd();
    }
  };

  const onSendReply = async () => {
    if (newMessage.trim() !== '' && replyingTo) {
      const reply: Message = {
        text: newMessage,
        id: replyingTo.id,
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
      setShowReplies(state => [...state, replyingTo.id]);
    }
    setIsReply(!isReply);
    console.log('Reply sent.');
  };

  const onSetTitle = (title: string) => {
    if (newTitle.trim() !== '') {
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
    toggleModal();
    setReplyingTo(item);
  };

  const onPressYesSubmit = () => {
    toggleModal();
    setIsReply(true);
  };

  const onPressReplyTab = (messageId: string) => {
    setShowReplies(state => {
      if (state.includes(messageId)) {
        return state.filter(id => id !== messageId);
      } else {
        return [...state, messageId];
      }
    });
  };

  const renderItem = ({item}: {item: Message}) => (
    <>
      <View>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: '#eee7da',
              padding: 8,
              marginVertical: 8,
              marginBottom: 20,
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 16, fontFamily: 'HighTide-Sans'}}>
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'HighTide-Sans',
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
                    alignItems: 'flex-end',
                    backgroundColor: '#b6e7cc',
                    borderColor: '#eee7da',
                    borderWidth: 1,
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
                      marginRight: 5,
                      marginBottom: 10,
                      fontFamily: 'HighTide-Sans',
                    }}>
                    {' ' + item.name}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {item.replies && (
          <TouchableOpacity onPress={() => onPressReplyTab(item.id)}>
            <View style={styles.redTab}>
              {showReplies.includes(item.id) ? (
                <Text
                  style={{
                    marginLeft: 5,
                    marginTop: 10,
                    fontSize: 8,
                    fontFamily: 'HighTide-Sans',
                    opacity: 0.7,
                  }}>
                  {'hide'}
                </Text>
              ) : (
                <Text
                  style={{
                    marginLeft: 5,
                    marginTop: 10,
                    fontSize: 8,
                    fontFamily: 'HighTide-Sans',
                    opacity: 0.7,
                  }}>
                  {'show'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
      {item.replies &&
        item.replies.length > 0 &&
        showReplies.includes(item.id) && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {item.replies.map(reply => (
              <View
                key={reply.id + reply.time}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: '#eee7da99',
                  padding: 8,
                  marginTop: 10,
                  marginVertical: 8,
                  borderRadius: 8,
                  minWidth: '90%',
                }}>
                <Text style={{fontSize: 16, fontFamily: 'HighTide-Sans'}}>
                  {reply.title}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'HighTide-Sans',
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
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        backgroundColor: '#b6e7cc98',
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
                          marginBottom: 10,
                          fontFamily: 'HighTide-Sans',
                          opacity: 0.7,
                        }}>
                        {'' + reply.name}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
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
        padding: 8,
        borderTopColor: '#b6e7cc',
        borderBottomColor: '#b6e7cc',
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderRadius: 5,
      }}>
      <ImageBackground
        style={{flex: 1}}
        imageStyle={{opacity: 0.3}}
        source={backgroundPhoto}>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            marginBottom: 10,
            marginTop: 20,
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
            style={styles.input2}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={newMessage => setNewMessage(newMessage)}
          />
        </View>
      </ImageBackground>
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
  input2: {
    height: 90,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
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
  redTab: {
    position: 'absolute',
    bottom: 5,
    left: '5%',
    width: '90%',
    height: 20,
    backgroundColor: '#eee7da99',
    borderRadius: 5,
  },
});

export default MessageBoardScreen;
