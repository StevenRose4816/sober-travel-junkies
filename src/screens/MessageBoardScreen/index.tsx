import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
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
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParams} from '../../navigation/types';
import Routes from '../../navigation/routes';
import {firebase} from '@react-native-firebase/database';
import styles from './styles';

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
  const userPhotoFromDB = route?.params.userPhotoFromDB;
  const fullName = route?.params.fullName;
  const backgroundPhoto = route?.params.backgroundPhoto;
  const date = new Date();
  const formattedDate = date.toDateString();
  const formattedTime = date.toLocaleTimeString();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isReply, setIsReply] = useState(false);
  const [showReplies, setShowReplies] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null!);
  console.log('re-render');

  useEffect(() => {
    readDataFromFirestore('messages', 'messages');
  }, []);

  const writeDataToFirestore = async (
    collection: string,
    data: any,
    docId: string,
  ) => {
    try {
      const ref = firebase.firestore().collection(collection).doc(docId);
      const response = await ref.set({data});
      return response;
    } catch (error) {
      console.log('error: ', error);
      return error;
    }
  };

  const readDataFromFirestore = async (collection: string, docId: string) => {
    try {
      const ref = firebase.firestore().collection(collection).doc(docId);
      const response = await ref.get();
      const data = response.data();
      if (data && Array.isArray(data.data)) {
        console.log('MessageS Array: ', JSON.stringify(data.data));
        setMessages(data.data);
        setData(true);
      } else {
        console.log('No data available or invalid format');
      }
      return response;
    } catch (error) {
      console.error('Error reading data from Firestore:', error);
      return error;
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
      await writeDataToFirestore('messages', updatedMessages, 'messages');
      setNewMessage('');
      onSetTitle(newTitle);
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
      await writeDataToFirestore('messages', updatedMessages, 'messages');
      setNewMessage('');
      setReplyingTo(null);
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

  const handleChangeText = useCallback(
    (text: string) => {
      setNewMessage(text);
    },
    [setNewMessage],
  );

  const renderItem = ({item}: {item: Message}) => (
    <>
      <View>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          <View style={styles.view1}>
            <Text style={styles.text3}>{item.title}</Text>
            <Text style={styles.text4}>{item.text}</Text>
            <View style={styles.view2}>
              <View style={styles.view3}>
                <Text style={styles.text5}>{item.time}</Text>
                <Text style={styles.text6}>{item.date}</Text>
              </View>
              <View style={styles.view4}>
                <View style={styles.view5}>
                  <Image
                    style={styles.image1}
                    source={
                      item.photo
                        ? {uri: item.photo}
                        : require('../../Images/profilepictureicon.png')
                    }></Image>
                  <Text style={styles.text7}>{item.name}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {!!item.replies && item.replies.length > 0 && (
          <TouchableOpacity onPress={() => onPressReplyTab(item.id)}>
            <View style={styles.redTab}>
              {showReplies.includes(item.id) ? (
                <Text style={styles.text8}>{'hide'}</Text>
              ) : (
                <Text style={styles.text9}>{'show'}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
      {item.replies &&
        item.replies.length > 0 &&
        showReplies.includes(item.id) && (
          <View style={styles.view6}>
            {item.replies.map(reply => (
              <View key={reply.id + reply.time} style={styles.view7}>
                <Text style={styles.text10}>{reply.title}</Text>
                <Text style={styles.text11}>{reply.text}</Text>
                <View style={styles.view8}>
                  <View style={styles.view9}>
                    <Text style={styles.text12}>{reply.time}</Text>
                    <Text style={styles.text13}>{reply.date}</Text>
                  </View>
                  <View style={styles.view10}>
                    <View style={styles.view11}>
                      <Image
                        style={styles.image2}
                        source={
                          reply.photo
                            ? {uri: reply.photo}
                            : require('../../Images/profilepictureicon.png')
                        }></Image>
                      <Text style={styles.text14}>{reply.name}</Text>
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
            keyExtractor={item => item.id + item.time}
            renderItem={renderItem}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input2}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={handleChangeText}
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
                  color: '#0c0b09',
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
                  backgroundColor: '#e7b6cc',
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  width: 120,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#0c0b09',
                    fontSize: 18,
                    fontFamily: 'HighTide-Sans',
                  }}>
                  {'Yes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleModal}
                style={{
                  marginTop: 20,
                  backgroundColor: '#e7b6cc',
                  minHeight: 50,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  width: 120,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#0c0b09',
                    fontSize: 18,
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

export default MessageBoardScreen;
