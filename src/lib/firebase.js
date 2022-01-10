import Firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCKGfT-ea_hyngCxhLfWdkqM2E0D25nd8c",
  authDomain: "sub-you.firebaseapp.com",
  projectId: "sub-you",
  storageBucket: "sub-you.appspot.com",
  messagingSenderId: "768587340400",
  appId: "1:768587340400:web:adefb22e5b2e24ad4532b5",
  databaseURL: "https://sub-you-default-rtdb.firebaseio.com/",
  measurementId: "G-70BNCSH2RN",
};

// Initialize Firebase
const firebase = Firebase.initializeApp(firebaseConfig);
const { FieldValue } = Firebase.firestore;
const storageRef = Firebase.storage().ref();
const rtDBRef = firebase.database().ref();

export { firebase, FieldValue, storageRef, rtDBRef };
