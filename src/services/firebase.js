import { useContext } from "react";
import FirebaseContext from "../context/firebase";
import { FieldValue, firebase, storageRef } from "../lib/firebase";

export const singInWithGoogleInfoToFB = async (info) => {
  await firebase
    .firestore()
    .collection("usersGoogle")
    .doc(info.additionalUserInfo.profile.email)
    .set({
      userEmail: info.additionalUserInfo.profile.email,
      uid: info.user.uid,
      username: info.additionalUserInfo.profile.name,
      following: [],
      followers: [],
      dateCreated: Date.now(),
      profileImg: info.user.photoURL,
      profileCaption: "",
    });
};
export const signInWithFacebookInfoToFB = async (info) => {
  await firebase
    .firestore()
    .collection("usersFacebook")
    .doc(info.additionalUserInfo.profile.email)
    .set({
      userEmail: info.additionalUserInfo.profile.email,
      uid: info.user.uid,
      username: info.additionalUserInfo.profile.name,
      following: [],
      followers: [],
      dateCreated: Date.now(),
      profileImg: info.user.photoURL,
      profileCaption: "",
    });
};

export async function doesEmailExist(username) {
  const result = await firebase
    .firestore()
    .collection("usersGoogle")
    .where("userEmail", "==", username)
    .get();

  return result.docs.length > 0;
}

export const signupWithEmail = async (email, password, username) => {
  const createdUserResult = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);

  // authentication
  // -> emailAddress & password & username
  await createdUserResult.user.updateProfile({
    displayName: username,
  });
  console.log(createdUserResult);
  await firebase.firestore().collection("users").doc("email").set({
    userId: createdUserResult.user.uid,
    username: username.toLowerCase(),
    emailAddress: email.toLowerCase(),
    following: [],
    followers: [],
    dateCreated: Date.now(),
    profileImg: "",
    profileCaption: "",
  });
};
