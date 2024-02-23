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
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('../../Images/STJ.png')}
        style={{height: 275, width: 275, marginTop: 50}}></Image>
      <TextInput
        style={{
          backgroundColor: '#0c0b09',
          color: '#eee7da',
          width: 175,
          marginHorizontal: 10,
          borderRadius: 10,
          minHeight: 40,
          borderWidth: 1,
          borderColor: 'black',
          textAlign: 'center',
          fontFamily: 'Vonique64',
        }}
        placeholder=" username"
        placeholderTextColor={'#eee7da'}
        autoCapitalize={'none'}
        value={email}
        onChangeText={email => setEmail(email)}
      />
      <TextInput
        style={{
          textAlign: 'center',
          width: 175,
          backgroundColor: '#0c0b09',
          color: '#eee7da',
          marginHorizontal: 10,
          marginBottom: 10,
          marginTop: 5,
          borderRadius: 10,
          minHeight: 40,
          borderWidth: 1,
          borderColor: 'black',
          fontFamily: 'Vonique64',
        }}
        placeholder=" password"
        placeholderTextColor={'#eee7da'}
        value={password}
        onChangeText={password => setPassword(password)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={login}
        style={{
          backgroundColor: '#b6e7cc',
          minHeight: 35,
          width: screenWidth * 0.3,
          justifyContent: 'center',
          borderRadius: 10,
          marginHorizontal: 10,
          marginTop: 10,
          marginBottom: 10,
        }}>
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 14,
            textAlign: 'center',
            fontFamily: 'Vonique64',
            marginTop: 5,
          }}>
          {'LOGIN'}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../Images/arrowRight.png')}
          style={{
            height: 125,
            width: 125,
            marginRight: 10,
            marginTop: 10,
          }}></Image>
        <Text
          style={{
            color: '#0c0b09',
            fontSize: 12,
            fontFamily: 'Vonique64',
            textAlign: 'center',
          }}>
          {'OR'}
        </Text>
        <Image
          source={require('../../Images/arrowLeft.png')}
          style={{
            height: 125,
            width: 125,
            marginLeft: 10,
            marginTop: 10,
          }}></Image>
      </View>
      <TouchableOpacity
        // @ts-ignore
        onPress={() => navigate('Signup Screen')}
        style={{
          backgroundColor: '#b6e7cc',
          minHeight: 35,
          width: screenWidth * 0.4,
          justifyContent: 'center',
          borderRadius: 10,
          marginBottom: 80,
          marginTop: 10,
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
