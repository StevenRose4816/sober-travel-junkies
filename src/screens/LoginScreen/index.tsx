import {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  useWindowDimensions,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../../hooks';

const LoginScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const address = useAppSelector(state => state.globalStore.address);
  const name = useAppSelector(state => state.globalStore.name);
  const phoneNumber = useAppSelector(state => state.globalStore.phoneNumber);
  const user = auth().currentUser;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    console.log('Updated address=', address);
    console.log('name=', name);
    console.log('phoneNumber=', phoneNumber);
    console.log('user=', user);
  }, [address, name, phoneNumber, user]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const {navigate} = useNavigation();
  const navigation = useNavigation();
  const route = useRoute();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];

  useEffect(() => {
    console.log('current route is ', route);
    console.log('routes=', routes);
    console.log('previous route=', prevRoute);
  }, [routes, prevRoute]);

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      setErrorMessage(e);
      toggleModal();
    }
  };
  return (
    <ImageBackground
      source={require('../../Images/STJLogin.jpeg')}
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../../Images/STJ_Logo3.jpeg')}
        style={{height: 200, width: 200}}></Image>
      <TextInput
        style={{
          backgroundColor: 'white',
          width: 200,
          marginHorizontal: 10,
          borderRadius: 5,
          minHeight: 50,
          marginTop: 20,
          borderWidth: 1,
          borderColor: 'black',
        }}
        placeholder=" USERNAME"
        autoCapitalize={'none'}
        value={email}
        onChangeText={email => setEmail(email)}
      />
      <TextInput
        style={{
          width: 200,
          backgroundColor: 'white',
          marginHorizontal: 10,
          marginBottom: 10,
          marginTop: 10,
          borderRadius: 5,
          minHeight: 50,
          borderWidth: 1,
          borderColor: 'black',
        }}
        placeholder=" PASSWORD"
        value={password}
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={login}
        style={{
          backgroundColor: '#b6e7cc',
          minHeight: 45,
          width: screenWidth * 0.5,
          justifyContent: 'center',
          borderRadius: 10,
          marginHorizontal: 10,
          marginTop: 10,
          marginBottom: 10,
        }}>
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          {'LOGIN'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        // @ts-ignore
        onPress={() => navigate('Signup Screen')}
        style={{
          backgroundColor: '#b6e7cc',
          minHeight: 45,
          width: screenWidth * 0.6,
          justifyContent: 'center',
          borderRadius: 10,
          marginHorizontal: 10,
          marginTop: 10,
        }}>
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          {'CREATE ACCOUNT'}
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
    </ImageBackground>
  );
};

export default LoginScreen;
