import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  singInWithGoogleInfoToFB,
  signInWithFacebookInfoToFB,
  doesEmailExist,
} from "../services/firebase";
import propType from "prop-types";

export const signInWithGoogle = (navi) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      doesEmailExist(result.additionalUserInfo.profile.email).then((r) => {
        if (!r) {
          singInWithGoogleInfoToFB(result).then(() => {
            navi("/");
          });
        } else {
          navi("/");
        }
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const signOut = () => {
  firebase
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

export const signInWithFacebook = (navi) => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().useDeviceLanguage();
  provider.setCustomParameters({
    display: "popup",
  });

  provider.addScope("user_birthday");
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      signInWithFacebookInfoToFB(result);
      navi("/");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

signInWithGoogle.propType = {
  navi: propType.NavigateFunction,
};
signInWithFacebook.propType = {
  navi: propType.NavigateFunction,
};
