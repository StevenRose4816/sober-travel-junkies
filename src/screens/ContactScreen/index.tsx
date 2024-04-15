import {RouteProp, useRoute} from '@react-navigation/native';
import {FC} from 'react';
import {ScrollView, Text} from 'react-native';
import Contacts from 'react-native-contacts';
import {AppStackParams} from '../../navigation/types';
import Routes from '../../navigation/routes';

const ContactScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.contactScreen>>();
  const contacts = route.params;

  const filteredContacts = contacts.filter(
    contact => contact.familyName !== '' && contact.givenName !== '',
  );

  const mappedContacts = filteredContacts.map(contact => {
    const mobilePhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'mobile')
        ?.number || undefined;

    const mainPhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'main')
        ?.number || undefined;

    const homeFaxPhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'home fax')
        ?.number || undefined;

    const workPhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'work')
        ?.number || undefined;

    const homePhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'home')
        ?.number || undefined;

    return {
      familyName: contact.familyName,
      givenName: contact.givenName,
      phoneNumbers: {
        mobile: mobilePhoneNumber,
        main: mainPhoneNumber,
        homeFax: homeFaxPhoneNumber,
        work: workPhoneNumber,
        home: homePhoneNumber,
      },
    };
  });

  console.log('Contacts: ', JSON.stringify(contacts));
  console.log('Mapped Contacts: ', JSON.stringify(mappedContacts));

  return (
    <ScrollView>
      <Text>{JSON.stringify(mappedContacts)}</Text>
    </ScrollView>
  );
};

export default ContactScreen;
