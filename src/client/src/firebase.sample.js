import firebase from 'firebase/app';
import 'firebase/firebase-auth';

var firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};
// Initialize Firebase
export const fb = firebase.initializeApp(firebaseConfig);
