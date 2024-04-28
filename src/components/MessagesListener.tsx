import React, {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {collection} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {setMessages} from '../store/user/slice';

const MessagesListener = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const subscriber = firestore()
      .collection('messages')
      .doc('messages')
      .onSnapshot(documentSnapshot => {
        dispatch(setMessages({messages: documentSnapshot.data()}));
        console.log('User data: ', documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  return null;
};

export default MessagesListener;
