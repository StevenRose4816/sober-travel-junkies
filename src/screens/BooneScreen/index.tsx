import React, {FC, useState} from 'react';
import {Text, View} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const BooneScreen: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    console.log('date: ', selectedDate);
  };

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          borderRadius: 5,
          textAlign: 'center',
          marginTop: 40,
          marginBottom: 10,
          fontFamily: 'HighTide-Sans',
          fontSize: 18,
        }}>
        {'Valle Crucis 24'}
      </Text>
      <CalendarPicker
        onDateChange={handleDateChange}
        selectedDayStyle={{backgroundColor: 'red'}}
      />
      <Text
        style={{fontFamily: 'HighTide-Sans', marginLeft: 20, marginTop: 20}}>
        SELECTED DATES:{' '}
        {selectedDate ? selectedDate.toString() : 'None Selected'}
      </Text>
    </View>
  );
};

export default BooneScreen;
