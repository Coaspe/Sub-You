"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInWithFacebook = exports.signOut = exports.signInWithGoogle = void 0;
const app_1 = __importDefault(require("firebase/compat/app"));
require("firebase/compat/auth");
const firebase_1 = require("../service/firebase/firebase");
const signInWithGoogle = (navi) => {
    const provider = new app_1.default.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    return app_1.default
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
        (0, firebase_1.doesEmailExist)(result.additionalUserInfo.profile.email).then((r) => {
            if (!r) {
                (0, firebase_1.singInWithGoogleInfoToFB)(result).then(() => {
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
    app_1.default
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
    const provider = new app_1.default.auth.FacebookAuthProvider();
    app_1.default.auth().useDeviceLanguage();
    provider.setCustomParameters({
        display: "popup",
    });
    provider.addScope("user_birthday");
    return app_1.default
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
        (0, firebase_1.signInWithFacebookInfoToFB)(result);
        navi("/");
    })
        .catch((error) => {
        console.log(error.message);
    });
};
exports.signInWithFacebook = signInWithFacebook;
