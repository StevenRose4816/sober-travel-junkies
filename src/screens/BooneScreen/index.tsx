import React, {FC, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import CalendarPicker, {
  DateChangedCallback,
} from 'react-native-calendar-picker';

const BooneScreen: FC = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const minDate = new Date();
  const maxDate = new Date(2025, 1, 1);

  const generateDisabledDates = () => {
    const startDate = new Date(2025, 9, 1); // Month is 0-indexed
    const endDate = new Date(2025, 9, 31);
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
    }
  };

  const startDate = selectedStartDate ? selectedStartDate.toString() : '';
  const endDate = selectedEndDate ? selectedEndDate.toString() : '';
  const [showCalender, setShowCalender] = useState(false);

  const onPressViewCalender = () => {
    setShowCalender(showCalender => !showCalender);
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
      <TouchableOpacity
        style={{
          backgroundColor: '#b6e7cc',
          borderRadius: 5,
          width: 120,
        }}
        onPress={() => onPressViewCalender()}>
        <Text style={{fontFamily: 'HighTide-Sans', textAlign: 'center'}}>
          View Calender
        </Text>
      </TouchableOpacity>
      {showCalender && (
        <View style={{marginTop: 50}}>
          <CalendarPicker
            onDateChange={handleDateChange}
            selectedDayStyle={{backgroundColor: 'red'}}
            todayBackgroundColor={'grey'}
            textStyle={{fontFamily: 'HighTide-Sans'}}
            allowRangeSelection={true}
            allowBackwardRangeSelect={true}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={generateDisabledDates()}
          />
        </View>
      )}
      <Text
        style={{fontFamily: 'HighTide-Sans', marginLeft: 20, marginTop: 20}}>
        SELECTED START DATE: {startDate || 'None'} {'\n'}
        SELECTED END DATE: {endDate || 'None'}
      </Text>
    </View>
  );
};

export default BooneScreen;
