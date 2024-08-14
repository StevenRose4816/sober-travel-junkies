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
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackParams, NavPropAny} from '../../navigation/types';
import Routes from '../../navigation/routes';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {useAppSelector} from '../../hooks';
import {useSendEmail} from '../../hooks/SendEmail';
import {useDispatch} from 'react-redux';
import {setFullname, setSelectedDate} from '../../store/user/slice';

const CalendarScreen: FC = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedDateDescription, setSelectedDateDescription] = useState<
    string | null
  >(null);
  const [isDateValid, setIsDateValid] = useState(false);
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
  const screenHeight = Dimensions.get('window').height;
  const dispatch = useDispatch();
  const dateFromRedux = useAppSelector(state => state.user.selectedDate);

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
    switch (backgroundPhoto) {
      case '1':
        return require('../../Images/backgroundPhoto1.jpeg');
      case '2':
        return require('../../Images/backgroundPhoto2.jpeg');
      case '3':
        return require('../../Images/backgroundPhoto3.jpeg');
      case '4':
        return require('../../Images/backgroundPhoto4.jpeg');
      default:
        return null;
    }
  };

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
        toValue: screenHeight * 0.5,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: screenWidth * 0.2,
        duration: 200,
        useNativeDriver: true,
        delay: 900,
      }),
    ]).start();
  };

  const generateDisabledDates = () => {
    const startDate = new Date(2024, 9, 1);
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
      if (!!selectedHike) {
        dispatch(
          setSelectedDate({selectedDate: selectedHike.date.toISOString()}),
        );
        dispatch(setFullname({fullname: 'Test'}));
        console.log(
          'dispatched setSelectedDate, should see dateFromRedux soon...',
        );
      }
      setSelectedDateDescription(
        selectedHike ? selectedHike.description : null,
      );
      setIsDateValid(!!selectedHike);
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
    setShowModal(true);
  };

  useEffect(() => {
    if (!!dateFromRedux) {
      console.log('dateFromRedux: ', dateFromRedux);
    }
  }, [dateFromRedux]);

  const {sendEmail} = useSendEmail({
    dateFromRedux: dateFromRedux,
    subject: 'RSVP',
    recipients: ['steven_jangoh@yahoo.com', 'mstevenrose9517@gmail.com'],
    body: `Reservation Date: ${dateFromRedux} UID: ${userId}`,
  });

  const onPressYes = async () => {
    try {
      const event = await sendEmail();
      if (event !== 'cancelled') {
        Alert.alert('Success!', 'Thank you for your feedback!');
      }
    } catch (err) {
      console.log('error: ', err);
      Alert.alert('Oops!', 'Something went wrong..');
    }
    setShowModal(false);
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
          {!showCalendar && (
            <Animated.Image
              style={{
                height: 150,
                width: 300,
                transform: [{translateY}, {translateX}],
              }}
              source={require('../../Images/STJLogoTransparent.png')}></Animated.Image>
          )}
          {showCalendar && (
            <View>
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
                      marginRight: 5,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'HighTide-Sans',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Selected Date:
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'HighTide-Sans',
                        fontSize: 16,
                        color: 'gray',
                      }}>
                      Start Date: {startDate}
                    </Text>
                    {endDate !== '' && (
                      <Text
                        style={{
                          fontFamily: 'HighTide-Sans',
                          fontSize: 16,
                          color: 'gray',
                        }}>
                        End Date: {endDate}
                      </Text>
                    )}
                    {selectedDateDescription && (
                      <Text
                        style={{
                          fontFamily: 'HighTide-Sans',
                          fontSize: 16,
                          color: 'gray',
                          marginTop: 10,
                        }}>
                        Description: {selectedDateDescription}
                      </Text>
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
                    <TouchableOpacity
                      style={{
                        backgroundColor: isDateValid ? '#b6e7cc' : 'gray',
                        borderRadius: 5,
                        padding: 10,
                        marginTop: 5,
                      }}
                      onPress={onSubmitDate}
                      disabled={!isDateValid}>
                      <Text
                        style={{
                          fontFamily: 'HighTide-Sans',
                          textAlign: 'center',
                          fontSize: 16,
                          color: isDateValid ? 'black' : 'lightgray',
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ImageBackground>

      {/* Modal for confirmation */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: '80%',
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'HighTide-Sans',
                fontSize: 18,
                marginBottom: 20,
              }}>
              Are you sure you want to submit?
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#b6e7cc',
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
                width: '100%',
                alignItems: 'center',
              }}
              onPress={onPressYes}>
              <Text
                style={{
                  fontFamily: 'HighTide-Sans',
                  fontSize: 16,
                }}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#ff6f61',
                borderRadius: 5,
                padding: 10,
                width: '100%',
                alignItems: 'center',
              }}
              onPress={() => setShowModal(false)}>
              <Text
                style={{
                  fontFamily: 'HighTide-Sans',
                  fontSize: 16,
                  color: 'white',
                }}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CalendarScreen;
