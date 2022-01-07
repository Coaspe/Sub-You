import { firebase, storageRef, FieldValue } from "../lib/firebase";
import FastAverageColor from "fast-average-color";

export const singInWithGoogleInfoToFB = async (info: any) => {
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

export const signInWithFacebookInfoToFB = async (info: any) => {
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

export async function doesEmailExist(userEmail: string) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userEmail", "==", userEmail)
    .get();

  return result.docs.length > 0;
}

export const signupWithEmail = async (email: string, password: string, username: string) => {
  const createdUserResult: any = await firebase
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

export const getUserByEmail = async (email: string) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userEmail", "==", email.toLowerCase())
    .get();

  return result.docs.map((item: any) => ({ ...item.data() }))[0];
};

export async function uploadImage(
  caption: string,
  ImageUrl: Blob[],
  userInfo: any,
  category: any,
) {
  const postId = ImageUrl.map((image: any) => image.name);
  let aaa: any[] = [];
  let averageColor: any[] = [];

  const fac = new FastAverageColor();

  ImageUrl.map(async (imUrl: any) => {
    await storageRef.child(`${userInfo.email}/${imUrl.name}`).put(imUrl);
    await storageRef
      .child(`${userInfo.email}/${imUrl.name}`)
      .getDownloadURL()
      .then(async (res: any) => {
        await fac
          .getColorAsync(res)
          .then((color) => {
            averageColor.push(color.hex);
          })
          .catch((e) => {
            console.log(e);
          });

        aaa.push(res);

        if (aaa.length === ImageUrl.length) {
          return await firebase
            .firestore()
            .collection("posts")
            // Edit Later...
            .add({
              caption: caption,
              comments: [],
              dateCreated: Date.now(),
              imageSrc: aaa,
              postId: postId,
              likes: [],
              userId: userInfo.uid,
              category: category,
              averageColor: averageColor,
              avatarImgSrc: userInfo.photoURL,
            })
            .then(async (res: any) => {
              await firebase
                .firestore()
                .collection("users")
                .doc(userInfo.email)
                .update({
                  postDocId: FieldValue.arrayUnion(res.id),
                })
                // .then(() => {
                //   setAlert([true, "Upload", "success"]);
                //   setTimeout(() => {
                //     setAlert([false, "", ""]);
                //   }, 3000);
                //   setIsLoading(false);
                //   setPostSetChanged((ch: any) => {
                //     return ["upload", !ch[0]];
                //   });
                // })
                // .catch((error: any) => {
                //   setAlert([true, "Upload", "error"]);
                //   setTimeout(() => {
                //     setAlert([false, "", ""]);
                //   }, 3000);
                //   console.log(error);
                //   setIsLoading(false);
                // });
            });
        }
      });
  });
}

export async function getUserByUserId(userId: any) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("uid", "==", userId)
    .get();

  const user = result.docs.map((item: any) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user[0];
}

export async function getPhotos(userId: any, following: any) {
  const result = await firebase
    .firestore()
    .collection("posts")
    .where("userId", "in", following.concat(userId))
    .orderBy("dateCreated", "desc")
    .limit(3)
    .get();

  const userFollowedPhotos = result.docs.map((photo: any) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo: any) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username }: any = user;
      return { username, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

export async function getPhotosInfiniteScroll(userId:string, following:string, key:string) {
  console.log(userId, following, key);
  const result = await firebase
    .firestore()
    .collection("posts")
    .where("userId", "in", following.concat(userId))
    .orderBy("dateCreated", "desc")
    .startAfter(key)
    .limit(1)
    .get();

  const userFollowedPhotos = result.docs.map((photo: any) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo: any) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } : any = user;
      return { username, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

export async function deletePost(
  docId: any,
  userEmail: any,
  storageImageNameArr: any,
  setPostSetChanged: any,
  setIsLoading: any,
  setAlert: any
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
    storageImageNameArr.map((imageName: any) => {
      let desertRef = storageRef.child(`${userEmail}/${imageName}`);
      return desertRef.delete();
    })
  )
    .then(function () {
      setPostSetChanged((ch: any) => {
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
  let result: any = (await firebase.firestore().collection("users").get()).docs;
  result = result.map((doc: any) => doc.data());
  return result;
}

export async function getDocFirstImage(postDocIdArr: any) {
  if (postDocIdArr.length === 0) {
    console.log("No post !");
    return;
  }
  return await Promise.all(
    postDocIdArr.map(
      async (postDocId: any) =>
        await firebase.firestore().collection("posts").doc(postDocId).get()
    )
  );
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId: any, //currently logged in user document id // the user that someone requests to follow
  user: any,
  isFollowingProfile: any
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
  profileDocId: any, //currently logged in user document id// the user that someone requests to follow
  user: any,
  isFollowingProfile: any
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

export const getUserByEmailEncrypted = async (emailEncrypted: any) => {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userEmailEncrypted", "==", emailEncrypted)
    .get();

  return result.docs.map((item: any) => ({ ...item.data() }))[0];
};

export const getPostByDocId = async (docId: any) => {
  return (
    await firebase.firestore().collection("posts").doc(docId).get()
  ).data();
};
