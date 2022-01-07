import express from "express"
import "firebase/compat/auth";
import {
  deletePost,
  uploadImage
} from "./service/firebase";

const app: express.Express = express()

var admin = require("firebase-admin");
var serviceAccount = require("C:/sub-you-firebase-adminsdk-3lyxd-78e61d6399.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
})
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage()
});

const storage = new Storage({
  projectId: "sub-you",
  keyFilename: "C:/sub-you-firebase-adminsdk-3lyxd-fde6dbd60c.json"
});

const bucket = storage.bucket("gs://sub-you.appspot.com/");

app.post("/uploadpost", upload.any(), (req: any, res: express.Response) => {

  if (req.body.userEmail === undefined) {
    res.sendStatus(404)
    res.send("User Email Error!")
    res.end()
  }

  uploadImageToStorage(req.files, req.body.userEmail).then((resArr) => {
    res.send(JSON.stringify(resArr))
    res.end()
  })
})

app.post("/uploadpostFinish", (req: any, res: express.Response) => {
  
  if (req.body === {}) {
    res.sendStatus(404)
    res.send("User Email Error!")
    res.end()
  }
  
  uploadImage(req.body.caption, req.body.ImageUrl, req.body.userInfo, req.body.category)
    .then((re) => {
    const Response = {
      alert: [true, "Upload", "success"],
      loading: false,
      postSetChanged: ["upload", !req.body.postSetChanged[1]]
    }
    res.send(JSON.stringify(Response))
    res.end()
      
    }).catch((error: any) => {
    console.log(error);
    
    const Response = {
      alert: [true, "Upload", "error"],
      loading: false,
      error: error
    }
    res.send(JSON.stringify(Response))
    res.end()
  })

})
app.post("/deletepost", (req: any, res: express.Response) => {
  deletePost(req.body.docId, req.body.email, req.body.storageImageNameArr).then(() => {
    const Response = {
      alert: [true, "Delete", "success"],
      postSetChanged: ["delete", !req.body.postSetChanged[1]],
      loading: false
    }
    res.send(JSON.stringify(Response))
    res.end()

  }).catch((err) => {
    console.log(err.message);
    const Response = {
      alert: [true, "Delete", "error"],
      loading: false
    }
    res.send(JSON.stringify(Response))
    res.end()
  })
} )
const uploadImageToStorage = (file: any, userEmail: string) => {

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

app.listen(3001,() => {
  console.log('Server Operated!');
});
