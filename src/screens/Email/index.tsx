import React from 'react';
import {useSendEmail} from '../../hooks/SendEmail';
import {Alert, Text, TouchableOpacity} from 'react-native';

interface IPassedProps {
  subject: string;
  recipients: string[];
  body: string;
  touchableStyle?: any;
  textStyle?: any;
  title?: string;
}

export default function Email({
  subject,
  recipients,
  body,
  touchableStyle,
  textStyle,
  title,
}: IPassedProps) {
  const {sendEmail} = useSendEmail({
    subject: subject,
    recipients: recipients,
    body: body,
  });

  return (
    <>
      <TouchableOpacity
        style={touchableStyle}
        onPress={async () => {
          try {
            const event = await sendEmail();
            if (event !== 'cancelled') {
              Alert.alert('Success!', 'Thank you for your feedback!');
            }
          } catch (err) {
            console.log('error: ', err);
            Alert.alert('Oops!', 'Something went wrong..');
          }
        }}>
        <Text style={textStyle}>{title}</Text>
      </TouchableOpacity>
    </>
  );
}
