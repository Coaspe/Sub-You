import { firebase, storageRef, FieldValue } from "../lib/firebase";
import FastAverageColor from "fast-average-color";

export const singInWithGoogleInfoToFB = async (info) => {
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

export async function uploadImage(caption, ImageUrl, userInfo, category) {
  const postId = ImageUrl.map((image) => image.name);
  let aaa = [];
  let averageColor = [];

  const fac = new FastAverageColor();
  ImageUrl.map(async (imUrl) => {
    await storageRef.child(`${userInfo.email}/${imUrl.name}`).put(imUrl);
    await storageRef
      .child(`${userInfo.email}/${imUrl.name}`)
      .getDownloadURL()
      .then(async (res) => {
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
          await firebase
            .firestore()
            .collection("posts")
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
            })
            .then(async (res) => {
              await firebase
                .firestore()
                .collection("users")
                .doc(userInfo.email)
                .update({
                  // Already following remove ! Add following
                  postDocId: FieldValue.arrayUnion(res.id),
                });
            })
            .then(() => window.location.reload());
        }
      });
  });
}

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

  return user;
}

export async function getPhotos(userId, following) {
  const result1 =
    following.length > 0
      ? await firebase
          .firestore()
          .collection("posts")
          .where("userId", "in", following)
          .get()
      : null;

  const result2 = await firebase
    .firestore()
    .collection("posts")
    .where("userId", "==", userId)
    .get();

  const result =
    following.length > 0 ? result1.docs.concat(result2.docs) : result2.docs;

  const userFollowedPhotos = result.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0]; // first user
      return { username, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

export async function deletePost(docId, userEmail, storageImageNameArr) {
  await firebase.firestore().collection("posts").doc(docId).delete();
  await firebase
    .firestore()
    .collection("users")
    .doc(userEmail)
    .update({
      postDocId: FieldValue.arrayRemove(docId),
    });

  storageImageNameArr.map((imageName) => {
    let desertRef = storageRef.child(`${userEmail}/${imageName}`);

    desertRef
      .delete()
      .then(function () {
        window.location.reload();
      })
      .catch(function (error) {
        window.location.reload();
      });
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
    postDocIdArr.map(async (postDocId) =>
      (
        await firebase.firestore().collection("posts").doc(postDocId).get()
      ).data()
    )
  );
}
