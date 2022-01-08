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
exports.deletePostAdmin = exports.uploadImageAdmin = exports.uploadImageToStorage = void 0;
const firebase_1 = require("../../lib/firebase");
// NodeJS can not use getDownloadURL
// Make read permission public and write permission needs auth.
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: "sub-you",
    keyFilename: "C:/sub-you-firebase-adminsdk-3lyxd-fde6dbd60c.json"
});
const bucket = storage.bucket("gs://sub-you.appspot.com/");
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
var admin = require("firebase-admin");
var serviceAccount = require("C:/sub-you-firebase-adminsdk-3lyxd-78e61d6399.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://sub-you.appspot.com'
});
const firestore = getFirestore();
const uploadImageToStorage = (file, userEmail) => {
    let fileNameArr = file.map((data) => (new Promise((resolve, reject) => {
        if (!data) {
            reject('No image file');
        }
        let newFileName = `${Date.now()}_${userEmail}`;
        let fileUpload = bucket.file(`${userEmail}/${newFileName}`);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: data.mimetype,
            }
        });
        blobStream.on('error', (error) => {
            reject(error);
        });
        blobStream.on('finish', () => {
            resolve(newFileName);
        });
        blobStream.end(data.buffer);
    })));
    return Promise.all(fileNameArr);
};
exports.uploadImageToStorage = uploadImageToStorage;
function uploadImageAdmin(caption, ImageUrl, userInfo, category) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = ImageUrl;
        let averageColor = [];
        return Promise.all(ImageUrl.map((imUrl) => {
            return firebase_1.storageRef
                .child(`${userInfo.email}/${imUrl}`)
                .getDownloadURL();
        })).then((res) => {
            // firebase SDK Admin
            firestore
                .collection("posts")
                .add({
                caption: caption,
                comments: [],
                dateCreated: Date.now(),
                imageSrc: res,
                postId: postId,
                likes: [],
                userId: userInfo.uid,
                category: category,
                averageColor: averageColor,
                avatarImgSrc: userInfo.photoURL,
            }).then((rr) => {
                firestore
                    .collection("users")
                    .doc(userInfo.email)
                    .update({
                    postDocId: FieldValue.arrayUnion(rr.id),
                });
            });
        });
    });
}
exports.uploadImageAdmin = uploadImageAdmin;
function deletePostAdmin(docId, userEmail, storageImageNameArr) {
    return __awaiter(this, void 0, void 0, function* () {
        // setIsLoading(true);
        yield firestore.collection("posts").doc(docId).delete();
        yield firestore
            .collection("users")
            .doc(userEmail)
            .update({
            postDocId: FieldValue.arrayRemove(docId),
        });
        return Promise.all(storageImageNameArr.map((imageName) => {
            let desertRef = bucket.file(`${userEmail}/${imageName}`);
            return desertRef.delete();
        }));
    });
}
exports.deletePostAdmin = deletePostAdmin;