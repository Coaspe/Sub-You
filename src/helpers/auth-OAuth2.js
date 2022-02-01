import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  getAuth,
} from "firebase/auth";
import {
  singInWithGoogleInfoToFB,
  signInWithFacebookInfoToFB,
  doesEmailExist,
} from "../services/firebase";
import propType from "prop-types";

export const signInWithGoogle = (navi) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      doesEmailExist(result.user.email).then((r) => {
        if (!r) {
          console.log(r);
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

export const signOutAuth = () => {
  const auth = getAuth();
  signOut(auth)
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
  const provider = new FacebookAuthProvider();
  provider.setCustomParameters({
    display: "popup",
  });

  provider.addScope("user_birthday");
  return signInWithPopup(provider)
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
