"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostByDocId = exports.getUserByEmailEncrypted = exports.updateFollowedUserFollowers = exports.updateLoggedInUserFollowing = exports.getDocFirstImage = exports.getAllUser = exports.getPhotosInfiniteScroll = exports.getPhotos = exports.getUserByUserId = exports.getUserByEmail = exports.signupWithEmail = exports.doesEmailExist = exports.signInWithFacebookInfoToFB = exports.singInWithGoogleInfoToFB = void 0;
const firebase_1 = require("../../lib/firebase");
const singInWithGoogleInfoToFB = (info) => __awaiter(void 0, void 0, void 0, function* () {
    const CryptoJS = require("crypto-js");
    const secretKey = info.user.uid;
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(info.additionalUserInfo.profile.email.toLowerCase()), secretKey)
        .toString()
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, "");
    yield firebase_1.firebase
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
});
exports.singInWithGoogleInfoToFB = singInWithGoogleInfoToFB;
const signInWithFacebookInfoToFB = (info) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firebase
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
});
exports.signInWithFacebookInfoToFB = signInWithFacebookInfoToFB;
function doesEmailExist(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield firebase_1.firebase
            .firestore()
            .collection("users")
            .where("userEmail", "==", userEmail)
            .get();
        return result.docs.length > 0;
    });
}
exports.doesEmailExist = doesEmailExist;
const signupWithEmail = (email, password, username) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUserResult = yield firebase_1.firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
    yield createdUserResult.user.updateProfile({
        displayName: username,
    });
    yield firebase_1.firebase.firestore().collection("users").doc("email").set({
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
});
exports.signupWithEmail = signupWithEmail;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield firebase_1.firebase
        .firestore()
        .collection("users")
        .where("userEmail", "==", email.toLowerCase())
        .get();
    return result.docs.map((item) => (Object.assign({}, item.data())))[0];
});
exports.getUserByEmail = getUserByEmail;
function getUserByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield firebase_1.firebase
            .firestore()
            .collection("users")
            .where("uid", "==", userId)
            .get();
        const user = result.docs.map((item) => (Object.assign(Object.assign({}, item.data()), { docId: item.id })));
        return user[0];
    });
}
exports.getUserByUserId = getUserByUserId;
function getPhotos(userId, following) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield firebase_1.firebase
            .firestore()
            .collection("posts")
            .where("userId", "in", following.concat(userId))
            .orderBy("dateCreated", "desc")
            .limit(3)
            .get();
        const userFollowedPhotos = result.docs.map((photo) => (Object.assign(Object.assign({}, photo.data()), { docId: photo.id })));
        const photosWithUserDetails = yield Promise.all(userFollowedPhotos.map((photo) => __awaiter(this, void 0, void 0, function* () {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }
            const user = yield getUserByUserId(photo.userId);
            const { username } = user;
            return Object.assign(Object.assign({ username }, photo), { userLikedPhoto });
        })));
        return photosWithUserDetails;
    });
}
exports.getPhotos = getPhotos;
function getPhotosInfiniteScroll(userId, following, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield firebase_1.firebase
            .firestore()
            .collection("posts")
            .where("userId", "in", following.concat(userId))
            .orderBy("dateCreated", "desc")
            .startAfter(key)
            .limit(1)
            .get();
        const userFollowedPhotos = result.docs.map((photo) => (Object.assign(Object.assign({}, photo.data()), { docId: photo.id })));
        const photosWithUserDetails = yield Promise.all(userFollowedPhotos.map((photo) => __awaiter(this, void 0, void 0, function* () {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }
            const user = yield getUserByUserId(photo.userId);
            const { username } = user;
            return Object.assign(Object.assign({ username }, photo), { userLikedPhoto });
        })));
        return photosWithUserDetails;
    });
}
exports.getPhotosInfiniteScroll = getPhotosInfiniteScroll;
function getAllUser() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = (yield firebase_1.firebase.firestore().collection("users").get()).docs;
        result = result.map((doc) => doc.data());
        return result;
    });
}
exports.getAllUser = getAllUser;
function getDocFirstImage(postDocIdArr) {
    return __awaiter(this, void 0, void 0, function* () {
        if (postDocIdArr.length === 0) {
            console.log("No post !");
            return;
        }
        return yield Promise.all(postDocIdArr.map((postDocId) => __awaiter(this, void 0, void 0, function* () { return yield firebase_1.firebase.firestore().collection("posts").doc(postDocId).get(); })));
    });
}
exports.getDocFirstImage = getDocFirstImage;
function updateLoggedInUserFollowing(loggedInUserDocId, //currently logged in user document id // the user that someone requests to follow
user, isFollowingProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield firebase_1.firebase
            .firestore()
            .collection("users")
            .doc(loggedInUserDocId)
            .update({
            // Already following remove ! Add following
            following: isFollowingProfile
                ? firebase_1.FieldValue.arrayRemove(user)
                : firebase_1.FieldValue.arrayUnion(user),
        });
    });
}
exports.updateLoggedInUserFollowing = updateLoggedInUserFollowing;
function updateFollowedUserFollowers(profileDocId, //currently logged in user document id// the user that someone requests to follow
user, isFollowingProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield firebase_1.firebase
            .firestore()
            .collection("users")
            .doc(profileDocId)
            .update({
            followers: isFollowingProfile
                ? firebase_1.FieldValue.arrayRemove(user)
                : firebase_1.FieldValue.arrayUnion(user),
        });
    });
}
exports.updateFollowedUserFollowers = updateFollowedUserFollowers;
const getUserByEmailEncrypted = (emailEncrypted) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield firebase_1.firebase
        .firestore()
        .collection("users")
        .where("userEmailEncrypted", "==", emailEncrypted)
        .get();
    return result.docs.map((item) => (Object.assign({}, item.data())))[0];
});
exports.getUserByEmailEncrypted = getUserByEmailEncrypted;
const getPostByDocId = (docId) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield firebase_1.firebase.firestore().collection("posts").doc(docId).get()).data();
});
exports.getPostByDocId = getPostByDocId;
// export const getAverage = async (src: string) => {
//   function toDataUrl(src:string, callback: any) {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//         var reader = new FileReader();
//         reader.onloadend = function() {
//             callback(reader.result);
//         }
//         reader.readAsDataURL(xhr.response);
//     };
//     xhr.open('GET', src);
//     xhr.responseType = 'blob';
//     xhr.send();
//   }
//   toDataUrl(src, function(myBase64: string | ArrayBuffer | null) {
//     console.log(myBase64); // myBase64 is the base64 string
//   });
//   getAverageColor(src).then((res) => {
//   console.log(res.hex);
//   })
// }
