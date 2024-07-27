import React from 'react';
import {useSendEmail} from '../../hooks/SendEmail';
import {Alert, Text, TouchableOpacity} from 'react-native';

interface IPassedProps {
  subject: string;
  recipients: string[];
  body: string;
  style: any;
}

export default function Email({
  subject,
  recipients,
  body,
  style,
}: IPassedProps) {
  const {sendEmail} = useSendEmail({
    subject: subject,
    recipients: recipients,
    body: body,
  });

  return (
    <>
      <TouchableOpacity
        style={style}
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
        <Text style={{fontFamily: 'HighTide-Sans', opacity: 0.5, fontSize: 11}}>
          Report Image
        </Text>
      </TouchableOpacity>
    </>
  );
}
