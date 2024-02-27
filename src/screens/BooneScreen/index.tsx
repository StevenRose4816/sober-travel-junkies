import React, {FC, useEffect, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';

const TripInfoScreen: FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <View
      style={{
        flex: 1,
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
    </View>
  );
};

export default TripInfoScreen;
