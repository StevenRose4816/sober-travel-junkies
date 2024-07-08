import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
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
import FastImage from 'react-native-fast-image';
import {useAppSelector} from '../../hooks';

interface Message {
  text: string;
  id: string;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(false);
  const userPhotoFromDB = useAppSelector(state => state.user.userPhoto);
  const fullName = route?.params.fullName;
  const backgroundPhoto = route?.params.backgroundPhoto;
  const date = new Date();
  const formattedDate = date.toDateString();
  const formattedTime = date.toLocaleTimeString();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isReply, setIsReply] = useState(false);
  const [showReplies, setShowReplies] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null!);

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
      readDataFromFirestore('messages', 'messages');
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
  };

  const onPressMessage = (item: Message) => {
    setModalVisible(!modalVisible);
    setReplyingTo(item);
  };

  const onPressYesSubmit = () => {
    setModalVisible(!modalVisible);
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

  const renderReply = ({item}: {item: Message}) => (
    <View key={item.id + item.time} style={styles.view7}>
      <Text style={styles.text11}>{item.text}</Text>
      <View style={styles.view8}>
        <View style={styles.view9}>
          <Text style={styles.text12}>{item.time}</Text>
          <Text style={styles.text13}>{item.date}</Text>
        </View>
        <View style={styles.view10}>
          <View style={styles.view11}>
            {/* <Image
              style={styles.image2}
              source={
                item.photo
                  ? {uri: item.photo}
                  : require('../../Images/profilepictureicon.png')
              }
            /> */}
            <FastImage
              style={styles.image2}
              source={
                item.photo
                  ? {uri: item.photo, priority: FastImage.priority.high}
                  : require('../../Images/profilepictureicon.png')
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={1}
              style={styles.text14}>
              {item.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItem = ({item}: {item: Message}) => (
    <View>
      <View>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          <View style={styles.view1}>
            <Text style={styles.text4}>{item.text}</Text>
            <View style={styles.view2}>
              <View style={styles.view3}>
                <Text style={styles.text5}>{item.time}</Text>
                <Text style={styles.text6}>{item.date}</Text>
              </View>
              <View style={styles.view4}>
                <View style={styles.view5}>
                  <FastImage
                    style={styles.image1}
                    source={
                      item.photo
                        ? {uri: item.photo}
                        : require('../../Images/profilepictureicon.png')
                    }
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <Text
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                    style={styles.text7}>
                    {item.name}
                  </Text>
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
        item.replies.length >= 1 &&
        showReplies.includes(item.id) && (
          <View style={styles.view6}>
            <FlatList
              data={item.replies}
              keyExtractor={reply => reply.id + reply.time}
              renderItem={renderReply}
            />
          </View>
        )}
    </View>
  );
  return (
    <View style={styles.view12}>
      <ImageBackground
        style={styles.imageBackground1}
        imageStyle={styles.imageBackground2}
        source={backgroundPhoto}>
        <Text style={styles.text15}>{'Message Board'}</Text>
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
      <View style={styles.view13}>
        <TouchableOpacity
          style={styles.touchable1}
          onPress={!isReply ? onSend : onSendReply}>
          {!isReply ? (
            <Text style={styles.text16}>{'Send'}</Text>
          ) : (
            <Text style={styles.text17}>{'Reply'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable2}
          onPress={() => flatListRef.current?.scrollToEnd()}>
          <Text style={styles.text18}>{'Scroll to bottom'}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType={'slide'}
        transparent={true}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalView1}>
          <View style={styles.modalView2}>
            <View style={styles.modalView3}>
              <Text style={styles.text19}>{'Reply?'}</Text>
            </View>
            <View style={styles.modalView4}>
              <TouchableOpacity
                onPress={onPressYesSubmit}
                style={styles.touchable3}>
                <Text style={styles.text20}>{'Yes'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={styles.touchable4}>
                <Text style={styles.text21}>{'No'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageBoardScreen;
