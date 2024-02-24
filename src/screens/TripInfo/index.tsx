import React, {FC, useEffect, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';

const TripInfoScreen: FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <View
      style={{
        flex: 1,
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
    // const [data, setData] = useState(null);
    // const [fact, setFact] = useState(null);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await fetch('https://catfact.ninja/fact');
    //       const result = await response.json();

    //       setData(result);
    //       setFact(result.fact);
    //       setLoading(false);
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //       setLoading(false);
    //     }
    //   };

    //   fetchData();
    // }, []);

    // return (
    //   <View>
    //     {loading ? (
    //       <Text>Loading...</Text>
    //     ) : (
    //       <View>
    //         <Text>{JSON.stringify(fact)}</Text>
    //       </View>
    //     )}
    //   </View>
  );
};

export default TripInfoScreen;
