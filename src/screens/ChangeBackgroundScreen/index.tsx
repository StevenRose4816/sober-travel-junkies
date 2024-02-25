import {FC, useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {setBackgroundPhoto} from '../../store/backgroundPhoto/slice';
import {useAppSelector} from '../../hooks';

const ChangeBackgroundScreen: FC = () => {
  const dispatch = useDispatch();
  const [bgPhoto, setBgPhoto] = useState('');
  const backgroundPhotoUri = useAppSelector(state => state.backgroundPhoto.uri);

  useEffect(() => {
    console.log('backgroundPhotoUri: ', backgroundPhotoUri);
    console.log('bgPhoto: ', bgPhoto);
  }, [backgroundPhotoUri, bgPhoto]);

  const onPress = (photoSource: string) => {
    setBgPhoto(photoSource);
    dispatch(setBackgroundPhoto({uri: photoSource}));
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        backgroundColor: '#b6e7cc95',
      }}>
      <TouchableOpacity onPress={() => onPress('1')}>
        <Image
          style={{
            marginTop: 20,
            height: 100,
            width: 100,
            borderRadius: 10,
            marginLeft: 20,
          }}
          source={require('../../Images/backgroundPhoto1.jpeg')}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('2')}>
        <Image
          style={{height: 100, width: 100, borderRadius: 10, marginTop: 20}}
          source={require('../../Images/backgroundPhoto2.jpeg')}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('3')}>
        <Image
          style={{
            height: 100,
            width: 100,
            borderRadius: 10,
            marginRight: 20,
            marginTop: 20,
          }}
          source={require('../../Images/backgroundPhoto3.jpeg')}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('4')}>
        <Image
          style={{
            height: 100,
            width: 100,
            borderRadius: 10,
            marginTop: 20,
            marginLeft: 20,
          }}
          source={require('../../Images/backgroundPhoto4.jpeg')}></Image>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeBackgroundScreen;
