import {useRoute} from '@react-navigation/native';
import {FC} from 'react';
import {ScrollView, Text, View} from 'react-native';

const ContactScreen: FC = () => {
  const route = useRoute();
  const contacts = route.params;
  const contactsPrinted = JSON.stringify(contacts);

  return (
    <ScrollView>
      <Text>{contactsPrinted}</Text>
    </ScrollView>
  );
};
export default ContactScreen;
