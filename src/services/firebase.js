import { firebase, firestore, rtDBRef } from "../lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  startAfter,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayRemove,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { push, child, ref, update } from "firebase/database";

export const SUBSnapShot = (email, doSetUserInfo) => {
  onSnapshot(doc(firestore, "users", email), (doc) => {
    doSetUserInfo(doc.data());
  });
};

export const getComments = (postDocID) => {
  return getDocs(
    query(firestore, "comments"),
    where("__name__", "in", postDocID)
  );
};

export const getTimelinePhotos = async (uid) => {
  const q = query(collection(firestore, "users"), where("uid", "==", uid));
  const result = await getDocs(q);
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  const userTemp = user;
  const { following } = userTemp[0];

  return getPhotos(uid, following);
};

export const updateCommentLikes = async (userUID, commentDocID, like) => {
  return updateDoc(doc(firestore, "comments", commentDocID), {
    likes: like ? arrayRemove(userUID) : arrayUnion(userUID),
  });
};

export const getCommentsDocId = async (postDocID) => {
  return (await getDoc(doc(firestore, "posts", postDocID))).data().comments;
};

export const getCommentInfinite = async (postDocIDArr, key) => {
  const tmp = postDocIDArr.slice(key, key + 5);
  return await getDocs(
    query(collection(firestore, "comments"), where("__name__", "in", tmp))
  );
};

export const updateLastCheckedTime = (key, time) => {
  let tmp = {};
  tmp[key] = time;
  return update(ref(rtDBRef, `lastCheckedTime`), tmp);
};

export const makeMessageRoom = (users) => {
  const key = push(child(ref(rtDBRef), `chatRooms`)).key;

  let messageRoom = {
    users: users,
  };

  let updates = {};

  updates["/chatRooms/" + key] = messageRoom;
  return update(ref(rtDBRef), updates);
};

export const sendMessage = (key, message, user) => {
  const date = Date.now();
  return update(ref(rtDBRef, `chatRooms/${key}/messages/${date}`), {
    user: user,
    message: message,
    dateCreated: date,
  });
};

export const singInWithGoogleInfoToFB = (info) => {
  const CryptoJS = require("crypto-js");

  const secretKey = info.user.uid;
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(info.user.email.toLowerCase()),
    secretKey
  )
    .toString()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, "");

  return setDoc(doc(firestore, "users", info.user.email), {
    wallet: "",
    userEmail: info.user.email.toLowerCase(),
    uid: info.user.uid,
    username: info.user.displayName.toLowerCase(),
    following: [],
    followers: [],
    postDocId: [],
    dateCreated: Date.now(),
    profileImg: info.user.photoURL,
    profileCaption: "",
    userEmailEncrypted: encrypted,
    SUB: 0,
  });
};

export const signInWithFacebookInfoToFB = (info) => {
  setDoc(doc(firestore, "users", info.additionalUserInfo.profile.email), {
    wallet: "",
    userEmail: info.additionalUserInfo.profile.email.toLowerCase(),
    uid: info.user.uid,
    username: info.additionalUserInfo.profile.name.toLowerCase(),
    following: [],
    followers: [],
    postDocId: [],
    dateCreated: Date.now(),
    profileImg: info.user.photoURL,
    profileCaption: "",
  });
};
export async function doesEmailExist(userEmail) {
  const q = doc(firestore, "users", userEmail);
  const result = await getDoc(q);
  return result.exists();
}

// update version 9 later
export const signupWithEmail = async (email, password, username) => {
  const createdUserResult = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);

  await createdUserResult.user.updateProfile({
    displayName: username,
  });
  if (!doesEmailExist(email)) {
    await setDoc(doc(firestore, "users", email), {
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
  } else {
    console.log("Email already exsists!");
  }
};

export const getUserByEmail = async (email) => {
  await getDocs(
    query(
      collection(firestore, "users"),
      where("userEmail", "==", email.toLowerCase())
    )
  );
  const result = await getDocs(
    query(
      collection(firestore, "users"),
      where("userEmail", "==", email.toLowerCase())
    )
  );

  return result.docs.map((item) => ({ ...item.data() }))[0];
};

export async function getUserByUserId(userId) {
  const q = query(collection(firestore, "users"), where("uid", "==", userId));
  const result = await getDocs(q);

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user[0];
}

export async function getPhotos(userId, following) {
  const q = query(
    collection(firestore, "posts"),
    where("userId", "in", following.concat(userId)),
    orderBy("dateCreated", "desc"),
    limit(3)
  );

  const result = await getDocs(q);

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
  const q = query(
    collection(firestore, "posts"),
    where("userId", "in", following.concat(userId)),
    orderBy("dateCreated", "desc"),
    startAfter(key),
    limit(1)
  );
  const result = await getDocs(q);

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

export async function getAllUser() {
  let result = (await getDocs(query(collection(firestore, "users")))).docs;
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
      async (postDocId) => await getDoc(doc(firestore, "posts", postDocId))
    )
  );
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, //currently logged in user document id // the user that someone requests to follow
  user,
  isFollowingProfile
) {
  return await updateDoc(ref(firestore, `users/${loggedInUserDocId}`), {
    // Already following remove ! Add following
    following: isFollowingProfile ? arrayRemove(user) : arrayUnion(user),
  });
}
export async function updateFollowedUserFollowers(
  profileDocId, //currently logged in user document id// the user that someone requests to follow
  user,
  isFollowingProfile
) {
  return await updateDoc(ref(firestore, `users/${profileDocId}`), {
    // Already following remove ! Add following
    followers: isFollowingProfile ? arrayRemove(user) : arrayUnion(user),
  });
}

export const getUserByEmailEncrypted = async (emailEncrypted) => {
  await getDocs(
    query(
      collection(firestore, "users"),
      where("userEmailEncrypted", "==", emailEncrypted)
    )
  );
  const result = await getDocs(
    query(
      collection(firestore, "users"),
      where("userEmailEncrypted", "==", emailEncrypted)
    )
  );

  return result.docs.map((item) => ({ ...item.data() }))[0];
};

export const getPostByDocId = async (docId) => {
  return (await getDoc(doc(firestore, "posts", docId))).data();
};
