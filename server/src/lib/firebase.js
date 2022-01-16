"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRef = exports.FieldValue = exports.firebase = void 0;
const app_1 = __importDefault(require("firebase/compat/app"));
require("firebase/compat/firestore");
require("firebase/compat/auth");
require("firebase/compat/storage");
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
const firebase = app_1.default.initializeApp(firebaseConfig);
exports.firebase = firebase;
const { FieldValue } = app_1.default.firestore;
exports.FieldValue = FieldValue;
const storageRef = app_1.default.storage().ref();
exports.storageRef = storageRef;
