/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import {initializeApp} from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBxFFNg8EziZFEzXMKCzAcKtb0ieiVqSQo',
  authDomain: 'first-app-b5011.firebaseapp.com',
  projectId: 'first-app-b5011',
  storageBucket: 'first-app-b5011.appspot.com',
  messagingSenderId: '1005148767734',
  appId: '1:1005148767734:web:e40af5effb7e402be273d7',
};

const app = initializeApp(firebaseConfig);

AppRegistry.registerComponent(appName, () => App);
