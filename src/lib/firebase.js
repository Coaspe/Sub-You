import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, FieldValue } from "firebase/firestore";
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
const Firebase = initializeApp(firebaseConfig);
const firebase = Firebase.firebase;
const firestore = getFirestore(Firebase);
const storageRef = getStorage(Firebase);
const rtDBRef = getDatabase(Firebase);

export { firebase, firestore, FieldValue, storageRef, rtDBRef };
