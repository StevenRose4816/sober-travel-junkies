import {RouteProp, useRoute} from '@react-navigation/native';
import {FC} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AppStackParams} from '../../navigation/types';
import Routes from '../../navigation/routes';
import {SafeAreaView} from 'react-native-safe-area-context';

const ContactScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.contactScreen>>();
  const contacts = route.params;
  const screenHeight = Dimensions.get('window').height;

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.name}>
          {item.givenName} {item.familyName}
        </Text>
        <Text style={styles.phoneNumber}>
          {item.phoneNumbers.mobile && 'mobile:'} {item.phoneNumbers.mobile}
          {item.phoneNumbers.main && '\n' + 'main:'} {item.phoneNumbers.main}
          {item.phoneNumbers.homeFax && '\n' + 'home fax:'}{' '}
          {item.phoneNumbers.homeFax}
          {item.phoneNumbers.work && '\n' + 'work:'} {item.phoneNumbers.work}
          {item.phoneNumbers.home && '\n' + 'home:'} {item.phoneNumbers.home}
        </Text>
      </View>
    );
  };

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

  const mobilePhoneNumbers = mappedContacts
    .filter(contact => contact.phoneNumbers.mobile !== undefined)
    .map(contact => contact.phoneNumbers.mobile);

  console.log('Mobile Phone Numbers: ', mobilePhoneNumbers);
  console.log('Contacts: ', JSON.stringify(contacts));
  console.log('Mapped Contacts: ', JSON.stringify(mappedContacts));

  return (
    <SafeAreaView style={{height: screenHeight, marginTop: 40}}>
      <FlatList data={mappedContacts} renderItem={renderItem}></FlatList>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default ContactScreen;
