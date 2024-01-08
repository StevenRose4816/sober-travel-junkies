import {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  useWindowDimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import {useAppSelector} from '../../hooks';

const LoginScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const address = useAppSelector(state => state.globalStore.address);
  const name = useAppSelector(state => state.globalStore.name);
  const phoneNumber = useAppSelector(state => state.globalStore.phoneNumber);

  useEffect(() => {
    console.log('Updated address=', address);
    console.log('name=', name);
    console.log('phoneNumber=', phoneNumber);
  }, [address, name, phoneNumber]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const {navigate} = useNavigation();

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      setErrorMessage(e);
      toggleModal();
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{flex: 2, backgroundColor: 'white', justifyContent: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 25,
            fontWeight: '600',
          }}>
          {"Sojourn Women's Retreats"}
        </Text>
      </View>
      <View style={{flex: 3, backgroundColor: 'white'}}>
        <Text style={{marginLeft: 10}}>{'email'}</Text>
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            borderRadius: 5,
            minHeight: 50,
            borderWidth: 1,
            borderColor: 'black',
          }}
          autoCapitalize={'none'}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={{marginLeft: 10, marginTop: 10}}>{'password'}</Text>
        <TextInput
          style={{
            backgroundColor: 'white',
            marginHorizontal: 10,
            marginBottom: 10,
            borderRadius: 5,
            minHeight: 50,
            borderWidth: 1,
            borderColor: 'black',
          }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            backgroundColor: 'white',
            marginEnd: 10,
            marginStart: 10,
          }}>
          <TouchableOpacity
            // @ts-ignore
            onPress={() => navigate('Signup Screen')}
            style={{
              backgroundColor: 'blue',
              borderRadius: 5,
              marginLeft: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 10,
                marginTop: 10,
                marginRight: 10,
                marginLeft: 10,
              }}>
              {'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 60,
            backgroundColor: 'white',
          }}>
          <TouchableOpacity
            onPress={login}
            style={{
              backgroundColor: 'blue',
              minHeight: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginHorizontal: 10,
              marginTop: 20,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 21,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {'Login'}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType={'slide'}
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
                  backgroundColor: 'darkorange',
                  minHeight: 300,
                  width: '80%',
                  justifyContent: 'center',
                  borderRadius: 5,
                  padding: 20,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  {errorMessage + '\n'}
                </Text>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    marginTop: 20,
                    backgroundColor: 'blue',
                    minHeight: 50,
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 21,
                      fontWeight: '600',
                      backgroundColor: 'blue',
                      borderRadius: 5,
                    }}>
                    {'Close'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
