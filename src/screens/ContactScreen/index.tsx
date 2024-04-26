import {RouteProp, useRoute} from '@react-navigation/native';
import {FC, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppStackParams} from '../../navigation/types';
import Routes from '../../navigation/routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import Contacts from 'react-native-contacts';
import {User} from '../HomeScreen';
import {useAppSelector} from '../../hooks';
import {
  setHaveContactsBeenAdded,
  setContacts as setTheseContacts,
} from '../../store/contacts/index';
import {useDispatch} from 'react-redux';

const ContactScreen: FC = () => {
  const route = useRoute<RouteProp<AppStackParams, Routes.contactScreen>>();
  const {contacts, users, names} = route.params;
  const dispatch = useDispatch();
  const contactsFromState = useAppSelector(state => state.contacts.contacts);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [groupContactAdded, setGroupContactAdded] = useState(false);
  const [copiedText, setCopiedText] = useState<string | undefined>(undefined);
  const [addedContacts, setAddedContacts] = useState<
    (Contacts.Contact | User)[]
  >([]);
  const cleanedNames = names
    .filter(name => name.trim() !== '') // Remove empty strings
    .map(name => name.trim()); // Trim whitespaces from each string

  // Join the cleaned names with commas
  const formattedNames = cleanedNames.join(', ');

  console.log(formattedNames);

  useEffect(() => {
    retrieveCopyFromClipboard();
    if (!!copiedText) {
      console.log('copiedText: ', copiedText);
    } else {
      console.log('copied text is undefined');
    }
  }, [copiedText]);

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.name}>
          {item.givenName} {item.familyName}
        </Text>
        <Text style={styles.phoneNumber}>
          {'mobile:'} {item.phoneNumbers?.mobile}
          {'\n' + 'main:'} {item.phoneNumbers?.main}
          {'\n' + 'home fax:'} {item.phoneNumbers?.homeFax}
          {'\n' + 'work:'} {item.phoneNumbers?.work}
          {'\n' + 'home:'} {item.phoneNumbers?.home}
        </Text>
      </View>
    );
  };

  const filteredContacts = contactsFromState.filter(
    contact => contact.familyName !== '' && contact.givenName !== '',
  );

  const mappedContacts = filteredContacts.map(contact => {
    const mobilePhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'mobile')
        ?.number || '';

    const mainPhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'main')
        ?.number || '';

    const homeFaxPhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'home fax')
        ?.number || '';

    const workPhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'work')
        ?.number || '';

    const homePhoneNumber =
      contact.phoneNumbers.find(phoneNumber => phoneNumber.label === 'home')
        ?.number || '';

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

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const toggleModal2 = () => {
    setIsVisible2(!isVisible2);
  };

  const onPressAddGroup = () => {
    toggleModal();
    console.log('pressed');
  };

  const retrieveCopyFromClipboard = async () => {
    try {
      const text = await Clipboard.getString();
      setCopiedText(text);
    } catch (e: any) {
      console.log('error: ', e.message);
    }
  };

  const onAddGroupContact = async () => {
    toggleModal();
    try {
      const newContacts: User[] = [];
      for (const user of users) {
        await Contacts.addContact({
          givenName: user.givenName,
          familyName: user.familyName,
          phoneNumbers: [
            {label: 'mobile', number: user.phoneNumbers.mobile},
            {label: 'main', number: user.phoneNumbers.main},
            {label: 'home fax', number: user.phoneNumbers.homeFax},
            {label: 'work', number: user.phoneNumbers.work},
            {label: 'home', number: user.phoneNumbers.home},
          ],
        });
        newContacts.push({
          username: '',
          familyName: user.familyName,
          givenName: user.givenName,
          phoneNumbers: {
            mobile: user.phoneNumbers.mobile,
            main: user.phoneNumbers.main,
            homeFax: user.phoneNumbers.homeFax,
            work: user.phoneNumbers.work,
            home: user.phoneNumbers.home,
          },
        });
      }
      setAddedContacts(prevContacts => [...prevContacts, ...newContacts]);
      dispatch(setTheseContacts({contacts, ...newContacts}));
      console.log('Contacts added successfully');
      setGroupContactAdded(true);
      dispatch(setHaveContactsBeenAdded({haveContactsBeenAdded: true}));
      setIsVisible2(true);
    } catch (error: any) {
      console.error('Error adding contacts:', error.message);
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, height: screenHeight, marginTop: 40}}>
        <FlatList
          data={
            addedContacts.length > 0
              ? [...mappedContacts, ...addedContacts]
              : mappedContacts
          }
          renderItem={renderItem}></FlatList>
        <TouchableOpacity
          onPress={onPressAddGroup}
          style={{
            backgroundColor: !groupContactAdded ? '#b6e7cc' : '#b6e7cc50',
            borderRadius: 5,
            marginBottom: 20,
            marginLeft: 10,
            marginTop: 10,
            width: 100,
            borderWidth: 1,
            borderColor: '#eee7da',
            alignSelf: 'flex-start',
          }}
          disabled={groupContactAdded}>
          <Text
            style={{
              color: !groupContactAdded ? '#0c0b09' : '#0c0b0950',
              fontSize: 12,
              fontWeight: '600',
              margin: 10,
              textAlign: 'center',
              fontFamily: 'HighTide-Sans',
            }}>
            {'Add Group Contact'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Modal
        visible={isVisible}
        animationType={'fade'}
        transparent={true}
        onRequestClose={toggleModal}>
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
                  textAlign: 'center',
                  color: '#0c0b09',
                  marginTop: 40,
                  marginBottom: 50,
                  fontFamily: 'HighTide-Sans',
                }}>
                {'Do you want to add this Group Contact? '}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#0c0b09',
                  marginTop: 10,
                  marginBottom: 50,
                  fontFamily: 'HighTide-Sans',
                }}>
                {'(' + formattedNames + ')'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={onAddGroupContact}
                  style={{
                    backgroundColor: '#e7b6cc',
                    borderRadius: 5,
                    width: 100,
                    borderWidth: 1,
                    borderColor: '#eee7da',
                    marginRight: 5,
                  }}>
                  <Text
                    style={{
                      color: '#0c0b09',
                      fontSize: 12,
                      textAlign: 'center',
                      fontFamily: 'Vonique64',
                      margin: 10,
                    }}>
                    {'Add'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    backgroundColor: '#e7b6cc',
                    borderRadius: 5,
                    width: 100,
                    borderWidth: 1,
                    borderColor: '#eee7da',
                    marginLeft: 5,
                  }}>
                  <Text
                    style={{
                      color: '#0c0b09',
                      fontSize: 12,
                      textAlign: 'center',
                      fontFamily: 'Vonique64',
                      margin: 10,
                    }}>
                    {'Close'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isVisible2}
        animationType={'fade'}
        transparent={true}
        onRequestClose={toggleModal2}>
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
                  textAlign: 'center',
                  color: '#0c0b09',
                  marginTop: 40,
                  marginBottom: 50,
                  fontFamily: 'HighTide-Sans',
                }}>
                {'New contacts added successfully.'}
              </Text>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={toggleModal2}
                  style={{
                    backgroundColor: '#e7b6cc',
                    minHeight: 35,
                    width: screenWidth * 0.2,
                    justifyContent: 'center',
                    borderRadius: 10,
                    marginTop: 70,
                    marginRight: 5,
                  }}>
                  <Text
                    style={{
                      color: '#0c0b09',
                      fontSize: 12,
                      textAlign: 'center',
                      marginLeft: 10,
                      marginRight: 10,
                      marginTop: 5,
                      fontFamily: 'Vonique64',
                    }}>
                    {'close'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
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