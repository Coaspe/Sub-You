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
exports.makeAuction = exports.makeTransaction = exports.payForTransaction = exports.participateInAuction = exports.deleteComment = exports.addComment = exports.deletePostAdmin = exports.uploadImageAdmin = exports.uploadImageToStorage = exports.updateTime = exports.endAuction = exports.updateProfileWithoutImage = exports.updateProfileWithImage = void 0;
const firebase_1 = require("../../lib/firebase");
// NodeJS can not use getDownloadURL
// Make read permission public and write permission needs auth.
// Firebase Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: "sub-you",
    keyFilename: "C:/sub-you-firebase-adminsdk-3lyxd-fde6dbd60c.json"
});
const bucket = storage.bucket("gs://sub-you.appspot.com/");
// Firestore
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
// Firebase admin
var admin = require("firebase-admin");
var serviceAccount = require("C:/sub-you-firebase-adminsdk-3lyxd-78e61d6399.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://sub-you.appspot.com',
    databaseURL: "https://sub-you-default-rtdb.firebaseio.com/"
});
// Realtime Database
var db = admin.database();
const firestore = getFirestore();
const updateProfileWithImage = (userEmail, profileCaption, profileImg, username) => __awaiter(void 0, void 0, void 0, function* () {
    let newFileName = `${Date.now()}_${username}`;
    let fileUpload = bucket.file(`${userEmail}/profileImg/${newFileName}`);
    return (new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: profileImg.mimetype,
            }
        });
        blobStream.on('error', (error) => {
            reject(error);
        });
        blobStream.on('finish', () => {
            resolve(newFileName);
        });
        blobStream.end(profileImg.buffer);
    })).then(() => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield firebase_1.storageRef
            .child(`${userEmail}/profileImg/${newFileName}`)
            .getDownloadURL();
        firestore.collection("users").doc(userEmail).update({
            profileImg: token,
            profileCaption,
            username,
        });
    }));
});
exports.updateProfileWithImage = updateProfileWithImage;
const updateProfileWithoutImage = (userEmail, profileCaption, username) => __awaiter(void 0, void 0, void 0, function* () {
    return firestore.collection("users").doc(userEmail).update({
        profileCaption,
        username,
    });
});
exports.updateProfileWithoutImage = updateProfileWithoutImage;
const endAuction = (auctionKey) => {
    db.ref(`auctions/${auctionKey}`).update({ done: true });
};
exports.endAuction = endAuction;
const updateTime = (auctionKey, time) => {
    db.ref(`auctions/${auctionKey}`).update({ time: time });
};
exports.updateTime = updateTime;
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
function uploadImageAdmin(caption, ImageUrl, userInfo, category, averageColor) {
    return __awaiter(this, void 0, void 0, function* () {
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
                postId: ImageUrl,
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
const addComment = (text, userUID, postDocID, userProfileImg, username, dateCreated) => __awaiter(void 0, void 0, void 0, function* () {
    // Add new Comment to collection 'comments'
    const newComment = yield firestore
        .collection("comments")
        .add({
        dateCreated,
        likes: [],
        reply: [],
        text,
        userUID,
        userProfileImg,
        username
    });
    // Add new Comment's DocId to post's comments array
    yield firestore
        .collection("posts")
        .doc(postDocID)
        .update({
        comments: FieldValue.arrayUnion(newComment.id)
    });
});
exports.addComment = addComment;
const deleteComment = (postDocID, commentDocID) => {
    return Promise.all([firestore.collection("posts").doc(postDocID).update(({
            comments: FieldValue.arrayRemove(commentDocID)
        })),
        firestore.collection("comments").doc(commentDocID).delete()]);
};
exports.deleteComment = deleteComment;
const participateInAuction = (buyerUid, price, auctionKey, res) => {
    (0, exports.makeTransaction)(buyerUid, price, auctionKey, res).then(() => {
        db.ref(`auctions/${auctionKey}/buyers`).push(buyerUid);
        db.ref(`auctions/users/${buyerUid}/buy`).push(auctionKey);
    });
};
exports.participateInAuction = participateInAuction;
const payForTransaction = (buyerUid, price) => {
    const query = firestore.collection("users").where("uid", "==", buyerUid);
    return firestore.runTransaction((transaction) => {
        return transaction.get(query).then((doc) => {
            if (doc.docs[0]) {
                const user = doc.docs[0].data();
                if (user.SUB >= price) {
                    transaction.update(doc.docs[0]._ref, { SUB: user.SUB - price });
                    return Promise.resolve(user.SUB - price);
                }
                else {
                    return Promise.reject("MORESUBNEEDED");
                }
            }
        });
    });
};
exports.payForTransaction = payForTransaction;
const makeTransaction = (buyerUid, price, auctionKey, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastest = Object.values((yield db.ref(`auctions/${auctionKey}/transactions`).get()).val());
        if (price > lastest[lastest.length - 1].price) {
            // payment
            const payResult = yield (0, exports.payForTransaction)(buyerUid, price);
            // Add transaction
            const transactionResult = yield db.ref(`auctions/${auctionKey}/transactions`).transaction((trans) => {
                let time = new Date().getTime();
                let tmp = Object.assign({}, trans);
                tmp[time] = { price: price, userUid: buyerUid };
                return tmp;
            });
            if (lastest.length > 1) {
                console.log("payResult", payResult);
                console.log("transactionResult", transactionResult);
                return yield firestore.runTransaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
                    // 가장 최근에 등록된 호가 주인의 정보를 get하기 위한 query
                    const query = firestore.collection("users").where("uid", "==", lastest[lastest.length - 1].userUid);
                    // user를 get
                    const doc = yield transaction.get(query);
                    const user = doc.docs[0].data();
                    return transaction.update(doc.docs[0]._ref, { SUB: user.SUB + lastest[lastest.length - 1].price });
                })).catch((error) => {
                    console.log(error);
                });
            }
        }
        else {
            // 책정한 price가 가장 최근의 호가보다 작음
            throw "NEEDMOREPRICE";
        }
    }
    catch (error) {
        res.send(error);
        res.end();
    }
});
exports.makeTransaction = makeTransaction;
const makeAuction = (sellerUid, photoURL, firstPrice, time, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = db.ref("auctions").push().key;
    const firstTime = new Date().getTime();
    if (key === null) {
        return null;
    }
    let tmp = {};
    tmp["seller"] = sellerUid;
    tmp["photoURL"] = photoURL;
    tmp["time"] = time;
    tmp["done"] = false;
    const sellKey = db.ref(`auctions/users/${sellerUid}/sell`).push(key).key;
    const buyersKey = db.ref(`auctions/${key}/buyers`).push(sellerUid).key;
    if (sellKey && buyersKey) {
        try {
            const updateResult = yield db.ref(`auctions/${key}`).update(tmp);
            const setResult = yield db.ref(`auctions/${key}/transactions/${firstTime}`).set({
                price: firstPrice,
                userUid: sellerUid
            });
            res.send(`${updateResult}${setResult}`);
            res.end();
        }
        catch (error) {
            db.ref(`auctions/${key}`).remove();
            db.ref(`auction/users/${sellerUid}/sell/${sellKey}`).remove();
            res.status(404).send(error);
            res.end();
            return null;
        }
    }
    return key;
});
exports.makeAuction = makeAuction;
