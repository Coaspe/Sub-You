import Firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCKGfT-ea_hyngCxhLfWdkqM2E0D25nd8c",
  authDomain: "sub-you.firebaseapp.com",
  projectId: "sub-you",
  storageBucket: "sub-you.appspot.com",
  messagingSenderId: "768587340400",
  appId: "1:768587340400:web:adefb22e5b2e24ad4532b5",
  measurementId: "G-70BNCSH2RN",
  databaseURL: "https://sub-you-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const firebase = Firebase.initializeApp(firebaseConfig);
const { FieldValue } = Firebase.firestore;
const storageRef = Firebase.storage().ref();

export { firebase, FieldValue, storageRef };
