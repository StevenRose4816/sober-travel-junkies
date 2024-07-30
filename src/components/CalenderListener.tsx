import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {setHikeDate} from '../store/globalStore/slice';

const CalenderListener = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const subscriber = firestore()
      .collection('calender')
      .doc('calender')
      .onSnapshot(documentSnapshot => {
        //@ts-ignore
        dispatch(setHikeDate({hikeData: documentSnapshot.data()}));
        console.log('Dates: ', documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  return null;
};

export default CalenderListener;
