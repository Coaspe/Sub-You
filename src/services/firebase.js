import { firebase, storageRef, FieldValue, rtDBRef } from "../lib/firebase";

export const makeAuction = (sellerUid, photoURL) => {
  const key = rtDBRef.child("auctions").push().key;
  rtDBRef.child(`auctions/users/${sellerUid}/sell`).push(key);

  let tmp = {};
  tmp["seller"] = sellerUid;
  tmp["photoURL"] = photoURL;
  rtDBRef.child(`auctions/${key}`).update(tmp);
};

export const participateInAuction = (buyerUid, price, auctionKey) => {
  rtDBRef.child(`auctions/${auctionKey}/buyers`).push(buyerUid);
  rtDBRef.child(`auctions/users/${buyerUid}/buy`).push(auctionKey);
  makeTransaction(buyerUid, price, auctionKey);
};

export const makeTransaction = (buyerUid, price, auctionKey) => {
  let tmp = {};
  tmp[new Date().getTime()] = { price: price, userUid: buyerUid };

  rtDBRef.child(`auctions/${auctionKey}/transactions`).update(tmp);
};

export const updateLastCheckedTime = (key, time) => {
  const path = rtDBRef.child(`lastCheckedTime`);
  let tmp = {};
  tmp[key] = time;
  return path.update(tmp);
};

export const makeMessageRoom = (users) => {
  const key = rtDBRef.child("chatRooms").push().key;

  let messageRoom = {
    users: users,
  };

  let updates = {};

  updates["/chatRooms/" + key] = messageRoom;

  return rtDBRef.update(updates);
};

export const sendMessage = (key, message, user) => {
  const date = Date.now();
  const address = rtDBRef.child(`chatRooms/${key}/messages/${date}`);

  return address.update({
    user: user,
    message: message,
    dateCreated: date,
  });
};

export const singInWithGoogleInfoToFB = async (info) => {
  const CryptoJS = require("crypto-js");

  const secretKey = info.user.uid;
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(info.additionalUserInfo.profile.email.toLowerCase()),
    secretKey
  )
    .toString()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, "");

  await firebase
    .firestore()
    .collection("users")
    .doc(info.additionalUserInfo.profile.email)
    .set({
      userEmail: info.additionalUserInfo.profile.email.toLowerCase(),
      uid: info.user.uid,
      username: info.additionalUserInfo.profile.name.toLowerCase(),
      following: [],
      followers: [],
      postDocId: [],
      dateCreated: Date.now(),
      profileImg: info.user.photoURL,
      profileCaption: "",
      userEmailEncrypted: encrypted,
    });
};

export const signInWithFacebookInfoToFB = async (info) => {
  await firebase
    .firestore()
    .collection("users")
    .doc(info.additionalUserInfo.profile.email)
    .set({
      userEmail: info.additionalUserInfo.profile.email.toLowerCase(),
      uid: info.user.uid,
      username: info.additionalUserInfo.profile.name.toLowerCase(),
      following: [],
      followers: [],
      dateCreated: Date.now(),
      profileImg: info.user.photoURL,
      profileCaption: "",
    });
};

export async function doesEmailExist(userEmail) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userEmail", "==", userEmail)
    .get();

  return result.docs.length > 0;
}

export const signupWithEmail = async (email, password, username) => {
  const createdUserResult = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);

  await createdUserResult.user.updateProfile({
    displayName: username,
  });
  await firebase.firestore().collection("users").doc("email").set({
    uid: createdUserResult.user.uid,
    username: username.toLowerCase(),
    userEmail: email.toLowerCase(),
    postDocId: [],
    following: [],
    followers: [],
    dateCreated: Date.now(),
    profileImg: "",
    profileCaption: "",
  });
};

export const getUserByEmail = async (email) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userEmail", "==", email.toLowerCase())
    .get();

  return result.docs.map((item) => ({ ...item.data() }))[0];
};

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("uid", "==", userId)
    .get();

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user[0];
}

export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection("posts")
    .where("userId", "in", following.concat(userId))
    .orderBy("dateCreated", "desc")
    .limit(3)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user;
      return { username, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

export async function getPhotosInfiniteScroll(userId, following, key) {
  const result = await firebase
    .firestore()
    .collection("posts")
    .where("userId", "in", following.concat(userId))
    .orderBy("dateCreated", "desc")
    .startAfter(key)
    .limit(1)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user;
      return { username, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

export async function deletePost(
  docId,
  userEmail,
  storageImageNameArr,
  setPostSetChanged,
  setIsLoading,
  setAlert
) {
  setIsLoading(true);

  await firebase.firestore().collection("posts").doc(docId).delete();
  await firebase
    .firestore()
    .collection("users")
    .doc(userEmail)
    .update({
      postDocId: FieldValue.arrayRemove(docId),
    });

  await Promise.all(
    storageImageNameArr.map((imageName) => {
      let desertRef = storageRef.child(`${userEmail}/${imageName}`);
      return desertRef.delete();
    })
  )
    .then(function () {
      setPostSetChanged((ch) => {
        return ["delete", !ch[0]];
      });
      setAlert([true, "Delete", "success"]);
      setTimeout(() => {
        setAlert([false, "", ""]);
      }, 3000);
      setIsLoading(false);
    })
    .catch(function (error) {
      console.log(error);
      setIsLoading(false);
      setAlert([true, "Delete", "error"]);
      setTimeout(() => {
        setAlert([false, "", ""]);
      }, 3000);
      return;
    });
}

export async function getAllUser() {
  let result = (await firebase.firestore().collection("users").get()).docs;
  result = result.map((doc) => doc.data());
  return result;
}

export async function getDocFirstImage(postDocIdArr) {
  if (postDocIdArr.length === 0) {
    console.log("No post !");
    return;
  }
  return await Promise.all(
    postDocIdArr.map(
      async (postDocId) =>
        await firebase.firestore().collection("posts").doc(postDocId).get()
    )
  );
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, //currently logged in user document id // the user that someone requests to follow
  user,
  isFollowingProfile
) {
  return await firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      // Already following remove ! Add following
      following: isFollowingProfile
        ? FieldValue.arrayRemove(user)
        : FieldValue.arrayUnion(user),
    });
}
export async function updateFollowedUserFollowers(
  profileDocId, //currently logged in user document id// the user that someone requests to follow
  user,
  isFollowingProfile
) {
  return await firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(user)
        : FieldValue.arrayUnion(user),
    });
}

export const getUserByEmailEncrypted = async (emailEncrypted) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userEmailEncrypted", "==", emailEncrypted)
    .get();

  return result.docs.map((item) => ({ ...item.data() }))[0];
};

export const getPostByDocId = async (docId) => {
  return (
    await firebase.firestore().collection("posts").doc(docId).get()
  ).data();
};
