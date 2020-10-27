/** @format */
import firebase from "firebase/app";
import "firebase/firebase-auth";

var firebaseConfig = {
  apiKey: "AIzaSyBbMVirSsh8N5y6QPVIhZf8WRX-EcOJVK0",
  authDomain: "pxliot.firebaseapp.com",
  databaseURL: "https://pxliot.firebaseio.com",
  projectId: "pxliot",
  storageBucket: "pxliot.appspot.com",
  messagingSenderId: "922090057435",
  appId: "1:922090057435:web:ac01c6cd520cfd8adda6fe"
};
// Initialize Firebase
export const fb = firebase.initializeApp(firebaseConfig);
