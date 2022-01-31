import { storageRef } from "../../lib/firebase";
import express from "express"

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
  db.ref(`auctions/${auctionKey}`).update({done: true})
}
export const updateTime = (auctionKey: string, time: number) => {
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

export const deleteComment = (postDocID: string, commentDocID: string) => {
  return Promise.all(
    [firestore.collection("posts").doc(postDocID).update(({
      comments: FieldValue.arrayRemove(commentDocID)
    })),
    firestore.collection("comments").doc(commentDocID).delete()]
  )
}

export const participateInAuction = (buyerUid: string, price: string, auctionKey: string, res: express.Response) => {
  makeTransaction(buyerUid, price, auctionKey, res).then(() => {
    db.ref(`auctions/${auctionKey}/buyers`).push(buyerUid)
    db.ref(`auctions/users/${buyerUid}/buy`).push(auctionKey)
  })
};

export const payForTransaction = (buyerUid: string, price: string) => {
  const query = firestore.collection("users").where("uid", "==", buyerUid)

  return firestore.runTransaction((transaction: any) => {
    return transaction.get(query).then((doc: any) => {
        if (doc.docs[0]) {
          const user = doc.docs[0].data()
          if (parseInt(user.SUB) >= parseInt(price)) {
            transaction.update(doc.docs[0]._ref, { SUB: parseInt(user.SUB) - parseInt(price) })
            return Promise.resolve(user.SUB - parseInt(price))
          } else {
            return Promise.reject("MORESUBNEEDED")
          }
        }
      })
  })


}
export const makeTransaction = async (buyerUid: string, price: string, auctionKey: string, res: express.Response) => {
  try {
    const lastest: { price: string; userUid: string; }[] = Object.values((await db.ref(`auctions/${auctionKey}/transactions`).get()).val())
    
    if (parseInt(price) > parseInt(lastest[lastest.length - 1].price)) {
      // payment
      const payResult = await payForTransaction(buyerUid, price)
      let time = new Date().getTime();
      await db.ref(`auctions/${auctionKey}/transactions`).transaction((trans: any) => {
        let tmp = Object.assign({}, trans)
        tmp[time] = { price: parseInt(price), userUid: buyerUid }
        return tmp
      }, (error:any, committed:any) => {
        if (committed) {
          res.send(`${payResult}`)
          // committe이 되었다면 가장 최근이었던 transaction을 취소하며 SUB을 돌려준다.
          firestore.runTransaction((transaction: any) => {
            const query = firestore.collection("users").where("uid", "==", lastest[lastest.length - 1].userUid)
            // user를 get하고 sub 갱신
            return transaction.get(query).then((doc: any) => {
              if (doc.docs[0]) {
                const user = doc.docs[0].data()
                transaction.update(doc.docs[0]._ref, { SUB: parseInt(user.SUB) + parseInt(lastest[lastest.length - 1].price) })
              } else {
                return Promise.reject("NOUSER")
              }
            })
          })
        } else {
          // committe error
          return Promise.reject("COMMITTERROR")
        }
      })
    } else {
      // SUB가 부족
      throw "MORESUBNEEDED"
    }
  } catch (error) {
    res.send(error)
    res.end()
  }
};

export const makeAuction = (sellerUid: string, photoURL: string, firstPrice: string, time:number, res:express.Response) => {
  const key = db.ref("auctions").push().key
  const firstTime = new Date().getTime()

  if (key === null) {
    return -1
  }

  let tmp: any = {};
  tmp["seller"] = sellerUid;
  tmp["photoURL"] = photoURL;
  tmp["time"] = time;
  tmp["done"] = false;

  if (key !== null) {
    const sellKey = db.ref(`auctions/users/${sellerUid}/sell`).push(key).key
    const buyersKey = db.ref(`auctions/${key}/buyers`).push(sellerUid).key

    if (sellKey && buyersKey) {
      db.ref(`auctions/${key}`).update(tmp)
        .then(() => {
          db.ref(`auctions/${key}/transactions/${firstTime}`).set({
            price: parseInt(firstPrice),
            userUid: sellerUid
          }, (error: any) => {
            if (!error) {
              res.status(200).send("경매 등록을 성공하였습니다")
              res.end()
              return 0
            }
          })
      }).catch((error: any) => {
          db.ref(`auctions/${key}`).remove()
          db.ref(`auction/users/${sellerUid}/sell/${sellKey}`).remove()
          res.status(404).send(error)
          res.end()
          return -1
      })
    }
  }
  return key;
};
