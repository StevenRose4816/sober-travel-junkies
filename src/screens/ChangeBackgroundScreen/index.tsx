import {FC} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';

const ChangeBackgroundScreen: FC = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        backgroundColor: '#b6e7cc95',
      }}>
      <TouchableOpacity>
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
      <TouchableOpacity>
        <Image
          style={{height: 100, width: 100, borderRadius: 10, marginTop: 20}}
          source={require('../../Images/backgroundPhoto2.jpeg')}></Image>
      </TouchableOpacity>
      <TouchableOpacity>
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
      <TouchableOpacity>
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
