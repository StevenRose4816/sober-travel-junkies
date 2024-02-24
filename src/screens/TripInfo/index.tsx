import React, {FC} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';

const TripInfoScreen: FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  return (
    <View
      style={{
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }}>
      <TouchableOpacity
        style={{
          height: 100,
          width: screenWidth * 0.4,
          marginRight: 10,
          marginTop: 40,
          marginLeft: 10,
          backgroundColor: '#eee7da',
          borderRadius: 5,
        }}>
        <Text
          style={{
            borderRadius: 5,
            textAlign: 'center',
            marginTop: 40,
            marginBottom: 10,
            fontFamily: 'HighTide-Sans',
            fontSize: 18,
          }}>
          {"Boone 24'"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 100,
          width: screenWidth * 0.4,
          marginRight: 10,
          marginTop: 40,
          marginLeft: 10,
          backgroundColor: '#eee7da',
          borderRadius: 5,
        }}>
        <Text
          style={{
            borderRadius: 5,
            marginTop: 40,
            textAlign: 'center',
            marginBottom: 10,
            fontFamily: 'HighTide-Sans',
            fontSize: 18,
          }}>
          {"Cozumel 25'"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 100,
          width: screenWidth * 0.4,
          marginRight: 10,
          marginTop: 40,
          marginLeft: 10,
          backgroundColor: '#eee7da',
          borderRadius: 5,
        }}>
        <Text
          style={{
            borderRadius: 5,
            marginTop: 40,
            textAlign: 'center',
            marginBottom: 10,
            fontFamily: 'HighTide-Sans',
            fontSize: 18,
          }}>
          {'Flight Information'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TripInfoScreen;
