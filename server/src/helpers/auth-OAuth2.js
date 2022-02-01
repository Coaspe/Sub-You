"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInWithFacebook = exports.signOut = exports.signInWithGoogle = void 0;
const firebase_1 = require("../lib/firebase");
const auth_1 = require("firebase/auth");
const firebase_2 = require("../service/firebase/firebase");
const signInWithGoogle = (navi) => {
    const provider = new auth_1.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    return firebase_1.firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
        (0, firebase_2.doesEmailExist)(result.additionalUserInfo.profile.email).then((r) => {
            if (!r) {
                (0, firebase_2.singInWithGoogleInfoToFB)(result).then(() => {
                    navi("/");
                });
            }
            else {
                navi("/");
            }
        });
    })
        .catch((error) => {
        console.log(error.message);
    });
};
exports.signInWithGoogle = signInWithGoogle;
const signOut = () => {
    firebase_1.firebase
        .auth()
        .signOut()
        .then(() => {
        // Sign-out successful.
        console.log("Sign out");
    })
        .catch((error) => {
        // An error happened.
        console.log(error.message);
    });
};
exports.signOut = signOut;
const signInWithFacebook = (navi) => {
    const provider = new auth_1.FacebookAuthProvider();
    firebase_1.firebase.auth().useDeviceLanguage();
    provider.setCustomParameters({
        display: "popup",
    });
    provider.addScope("user_birthday");
    return firebase_1.firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
        (0, firebase_2.signInWithFacebookInfoToFB)(result);
        navi("/");
    })
        .catch((error) => {
        console.log(error.message);
    });
};
exports.signInWithFacebook = signInWithFacebook;
