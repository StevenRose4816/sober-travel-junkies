import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';
import {getApps, getApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyBxFFNg8EziZFEzXMKCzAcKtb0ieiVqSQo',
  authDomain: 'first-app-b5011.firebaseapp.com',
  databaseURL: 'https://first-app-b5011-default-rtdb.firebaseio.com',
  projectId: 'first-app-b5011',
  storageBucket: 'first-app-b5011.appspot.com',
  messagingSenderId: '1005148767734',
  appId: '1:1005148767734:web:c930561ea7649582e273d7',
};

//Initizalize firebase

// const app = initializeApp(firebaseConfig);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

//Initialize database
export const db = getDatabase(app);
export const storage = getStorage(app);
