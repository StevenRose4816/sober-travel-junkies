import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker, {
  DateChangedCallback,
} from 'react-native-calendar-picker';
import {AppStackParams, NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import {firebase} from '@react-native-firebase/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Email from '../Email';
import auth from '@react-native-firebase/auth';
import {useAppSelector} from '../../hooks';

const CalendarScreen: FC = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedDateDescription, setSelectedDateDescription] = useState<
    string | null
  >(null);
  const minDate = new Date();
  const maxDate = new Date(2040, 6, 1);
  const route =
    useRoute<RouteProp<AppStackParams, Routes.messageBoardScreen>>();
  const backgroundPhoto = route.params.backgroundPhoto;
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation<NavPropAny>();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [dataBool, setDataBool] = useState(false);
  const [hikes, setHikes] = useState<any>(undefined);
  const userId = auth().currentUser?.uid;
  const username = useAppSelector(state => state.user.fullName);
  const useremail = useAppSelector(state => state.user.email);

  useEffect(() => {
    moveImage();
    fadeIn();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const renderBackground = () => {
    if (backgroundPhoto === '1') {
      return require('../../Images/backgroundPhoto1.jpeg');
    } else if (backgroundPhoto === '2') {
      return require('../../Images/backgroundPhoto2.jpeg');
    } else if (backgroundPhoto === '3') {
      return require('../../Images/backgroundPhoto3.jpeg');
    } else if (backgroundPhoto === '4') {
      return require('../../Images/backgroundPhoto4.jpeg');
    }
  };

  useEffect(() => {
    if (!!hikes) {
      console.log('hikes: ', hikes);
    }
  }, [hikes]);

  useEffect(() => {
    readDatesFromFirestore('calender', 'calender');
    readDatesFromFirestore('calender', 'hikes');
  }, []);

  const readDatesFromFirestore = async (collection: string, docId: string) => {
    try {
      const ref = firebase.firestore().collection(collection).doc(docId);
      const response = await ref.get();
      const data = response.data();
      if (data) {
        console.log('Data from store: ', JSON.stringify(data));
        setHikes(data.dates);
        setDataBool(true);
      } else {
        console.log('No data available or invalid format');
      }
      return response;
    } catch (error) {
      console.error('Error reading data from Firestore:', error);
      return error;
    }
  };

  const moveImage = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 460,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
        delay: 900,
      }),
    ]).start();
  };

  const generateDisabledDates = () => {
    const startDate = new Date(2024, 9, 1); // Month is 0-indexed
    const endDate = new Date(2024, 9, 31);
    const datesArray = [];
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      datesArray.push(new Date(d));
    }
    return datesArray;
  };

  const handleDateChange: DateChangedCallback = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      const selectedHike = importantDates.find(
        hike => hike.date.toDateString() === date.toDateString(),
      );
      setSelectedDateDescription(
        selectedHike ? selectedHike.description : null,
      );
    }
  };

  const convertHikesToDates = (
    hikes: string[],
  ): {date: Date; description: string}[] => {
    return hikes.map(hike => {
      const dateStr = hike.substring(0, 8);
      const description = hike.substring(9);
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1; // Months are 0-indexed
      const day = parseInt(dateStr.substring(6, 8));
      return {
        date: new Date(year, month, day),
        description,
      };
    });
  };

  const importantDates = convertHikesToDates(hikes || []);

  const customDatesStyles = importantDates.map(item => ({
    date: item.date,
    style: {backgroundColor: 'blue'},
    textStyle: {color: 'white'},
  }));

  const startDate = selectedStartDate
    ? selectedStartDate.toLocaleDateString()
    : '';
  const endDate = selectedEndDate ? selectedEndDate.toLocaleDateString() : '';
  const [showCalendar, setShowCalendar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onPressViewCalendar = () => {
    setShowCalendar(showCalendar => !showCalendar);
  };

  const onSubmitDate = () => {
    //we need to email Hollis and I for reservation
    setShowModal(showModal => !showModal);
  };

  const onPressYes = () => {
    setShowModal(showModal => !showModal);
    navigation.navigate(Routes.home_Screen);
  };

  const handleOnPress = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('calshow:');
    } else if (Platform.OS === 'android') {
      Linking.openURL('content://com.android.calendar/time/');
    } else {
      console.log(
        'Calendar functionality is only available on iOS and Android.',
      );
    }
  };

  return (
    <>
      <ImageBackground
        style={{flex: 1}}
        imageStyle={!showCalendar ? {opacity: 0.8} : {opacity: 0.2}}
        source={renderBackground()}>
        <View>
          <Text
            style={{
              borderRadius: 5,
              textAlign: 'center',
              marginTop: 40,
              marginBottom: 10,
              fontFamily: 'HighTide-Sans',
              fontSize: 18,
            }}>
            {"Valle Crucis 24'"}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#b6e7cc',
              borderRadius: 5,
              width: 120,
              marginLeft: 20,
              marginTop: 10,
              marginBottom: 10,
            }}
            onPress={onPressViewCalendar}>
            <Text
              style={{
                fontFamily: 'HighTide-Sans',
                textAlign: 'center',
                marginTop: 5,
                marginBottom: 5,
              }}>
              {!showCalendar ? 'View Trip Calendar' : 'Hide Trip Calendar'}
            </Text>
          </TouchableOpacity>
          {showCalendar && (
            <View style={{marginTop: 50}}>
              <CalendarPicker
                initialDate={new Date()}
                onDateChange={handleDateChange}
                todayBackgroundColor={'grey'}
                textStyle={{fontFamily: 'HighTide-Sans'}}
                allowRangeSelection={false}
                allowBackwardRangeSelect={false}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={generateDisabledDates()}
                selectedRangeStyle={{backgroundColor: '#b6e7cc'}}
                customDatesStyles={customDatesStyles}
              />
            </View>
          )}
          {startDate !== '' && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 20,
              }}>
              {showCalendar && (
                <>
                  <View
                    style={{
                      backgroundColor: '#eee7da',
                      maxWidth: screenWidth * 0.9,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'HighTide-Sans',
                        margin: 10,
                      }}>
                      Selected Date: {startDate || 'None'}
                    </Text>
                  </View>
                  {selectedDateDescription && showCalendar && (
                    <View
                      style={{
                        backgroundColor: '#eee7da',
                        maxWidth: screenWidth * 0.9,
                        borderRadius: 5,
                        marginTop: 10,
                        padding: 10,
                      }}>
                      <Text style={{fontFamily: 'HighTide-Sans'}}>
                        {selectedDateDescription}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#b6e7cc',
                      borderRadius: 5,
                      width: 120,
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                    onPress={handleOnPress}>
                    <Text
                      style={{
                        fontFamily: 'HighTide-Sans',
                        textAlign: 'center',
                        marginTop: 5,
                        marginBottom: 5,
                      }}>
                      Add To Your Calendar
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
        {!showCalendar && (
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <Animated.Image
              style={{
                height: 150,
                width: 300,
                transform: [{translateY}, {translateX}],
              }}
              source={require('../../Images/STJLogoTransparent.png')}></Animated.Image>
          </View>
        )}
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
          {/* <TouchableOpacity
            style={{
              // backgroundColor: endDate !== '' ? '#b6e7cc' : 'grey',
              backgroundColor: '#b6e7cc',
              borderRadius: 5,
              width: 120,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 5,
              // opacity: endDate !== '' ? 1 : 0.5,
            }}
            // disabled={endDate === ''}
            onPress={onSubmitDate}>
            <Text
              style={{
                fontFamily: 'HighTide-Sans',
                textAlign: 'center',
                marginTop: 5,
                marginBottom: 5,
              }}>
              Submit Date
            </Text>
          </TouchableOpacity> */}
          <Email
            // will need to set this up so that i can pass the onpress function in optionally for this use.
            //figure out a way to pass in textStyle to handle the text, currently the style on;y handles the touchable
            title="Submit"
            subject="RSVP"
            recipients={[
              'steven_jangoh@yahoo.com',
              'mstevenrose9517@gmail.com',
              'hollisarose@gmail.com',
            ]}
            body={
              'Resvervation Date: ' +
              startDate +
              ' UID: ' +
              userId +
              ' Name: ' +
              username +
              ' Email: ' +
              useremail
            }
            touchableStyle={{
              backgroundColor: '#b6e7cc',
              borderRadius: 5,
              width: 120,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 5,
              padding: 10,
            }}
            textStyle={{
              fontFamily: 'HighTide-Sans',
              fontSize: 11,
            }}
          />
        </View>
        <Modal
          visible={showModal}
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => setShowModal(showModal => !showModal)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: '#b6e7cc',
                minHeight: 300,
                width: '80%',
                borderRadius: 5,
                padding: 20,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'HighTide-Sans',
                    textAlign: 'center',
                    marginTop: 40,
                  }}>
                  Do you want to submit the following date?
                </Text>
                <Text
                  style={{
                    fontFamily: 'HighTide-Sans',
                    marginTop: 50,
                  }}>
                  {startDate}
                </Text>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{
                      marginTop: 40,
                      backgroundColor: 'blue',
                      minHeight: 50,
                      justifyContent: 'center',
                      borderRadius: 5,
                      marginHorizontal: 10,
                      width: 120,
                    }}
                    onPress={onPressYes}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#eee7da',
                        fontSize: 21,
                        fontWeight: '600',
                        backgroundColor: 'blue',
                        borderRadius: 5,
                        fontFamily: 'Vonique64',
                      }}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginTop: 40,
                      backgroundColor: 'blue',
                      minHeight: 50,
                      justifyContent: 'center',
                      borderRadius: 5,
                      marginHorizontal: 10,
                      width: 120,
                    }}
                    onPress={() => setShowModal(showModal => !showModal)}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#eee7da',
                        fontSize: 21,
                        fontWeight: '600',
                        backgroundColor: 'blue',
                        borderRadius: 5,
                        fontFamily: 'Vonique64',
                      }}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
};

export default CalendarScreen;
