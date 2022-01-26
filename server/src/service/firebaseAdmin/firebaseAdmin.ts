import { storageRef } from "../../lib/firebase";

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

const firestore = getFirestore()

export const updateProfileWithImage = async (
  userEmail: string,
  profileCaption: string,
  profileImg: any,
  username: string
) => {
    let newFileName = `${Date.now()}_${username}`;
    let fileUpload = bucket.file(`${userEmail}/profileImg/${newFileName}`);

    return (new Promise((resolve, reject) => {
        
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: profileImg.mimetype,
        }
      });

      blobStream.on('error', (error: any) => {
        reject(error);
      });

      blobStream.on('finish', () => {
        resolve(newFileName);
      });

      blobStream.end(profileImg.buffer);

    })).then(async () => {
      const token = await storageRef
        .child(`${userEmail}/profileImg/${newFileName}`)
        .getDownloadURL()
      
      firestore.collection("users").doc(userEmail).update({
        profileImg: token,
        profileCaption,
        username,
      })
    })
};

export const updateProfileWithoutImage = async (
  userEmail: string,
  profileCaption: string,
  username: string
) => {
  return firestore.collection("users").doc(userEmail).update({
    profileCaption,
    username,
  })
};
export const endAuction = (auctionKey: string) => {
  db.ref(`auctions/${auctionKey}`).update({done: false})
}
export const updateTime = (auctionKey: string, time: string) => {
  db.ref(`auctions/${auctionKey}`).update({time: time})
}

export const uploadImageToStorage = (file: any, userEmail: string) => {

  let fileNameArr = file.map((data: any) => (
    new Promise((resolve, reject) => {
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
  
      blobStream.on('error', (error:any) => {
        reject(error);
      });
  
      blobStream.on('finish', () => {
        resolve(newFileName);
      });
  
      blobStream.end(data.buffer);
    })));
  
  return Promise.all(fileNameArr)

}

export async function uploadImageAdmin(
  caption: string,
  ImageUrl: string[],
  userInfo: any,
  category: any,
  averageColor: string[]
) {

   return Promise.all(ImageUrl.map((imUrl: any) => {
      return storageRef
        .child(`${userInfo.email}/${imUrl}`)
        .getDownloadURL()
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
        }).then((rr: any) => {
          firestore
          .collection("users")
          .doc(userInfo.email)
          .update({
            postDocId: FieldValue.arrayUnion(rr.id),
          })
       })
    })     
}

export async function deletePostAdmin(
  docId: any,
  userEmail: any,
  storageImageNameArr: any,
) {
  await firestore.collection("posts").doc(docId).delete();
  await firestore
    .collection("users")
    .doc(userEmail)
    .update({
      postDocId: FieldValue.arrayRemove(docId),
    });

  return Promise.all(
    storageImageNameArr.map((imageName: any) => {
      let desertRef = bucket.file(`${userEmail}/${imageName}`)
      return desertRef.delete();
    }))
}

export const addComment = async (
  text: string,
  userUID: string,
  postDocID: string,
  userProfileImg: string,
  username: string,
  dateCreated: number) => {
  
  // Add new Comment to collection 'comments'
  const newComment = await firestore
    .collection("comments")
    .add({
      dateCreated,
      likes: [],
      reply: [],
      text,
      userUID,
      userProfileImg,
      username
    })
  
  // Add new Comment's DocId to post's comments array
  await firestore
    .collection("posts")
    .doc(postDocID)
    .update({
    comments: FieldValue.arrayUnion(newComment.id)
  })
}