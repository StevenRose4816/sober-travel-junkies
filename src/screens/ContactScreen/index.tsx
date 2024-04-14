import {RouteProp, useRoute} from '@react-navigation/native';
import {FC} from 'react';
import {ScrollView, Text, View} from 'react-native';
import Contacts from 'react-native-contacts';
import {AppStackParams} from '../../navigation/types';
import Routes from '../../navigation/routes';

const ContactScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.contactScreen>>();
  const contacts = route.params || [];
  const contactsPrinted = JSON.stringify(contacts);

  return (
    <ScrollView>
      <Text>{contactsPrinted}</Text>
    </ScrollView>
  );
};
export default ContactScreen;
