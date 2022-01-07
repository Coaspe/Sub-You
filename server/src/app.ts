import express from "express"
import { firebase, storageRef, FieldValue } from "./lib/firebase"
import Firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  uploadImage
} from "./service/firebase";


const app: express.Express = express()
const router = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
})
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const multer = Multer({
  storage: Multer.memoryStorage()
});

const bucket = storage.bucket("gs://sub-you.appspot.com/");

app.post("/uploadpost",multer.single('file'), (req: any, res: express.Response) => {
  console.log(req.file);
  
  uploadImageToStorage(req.file)
})
const uploadImageToStorage = (file:any) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    console.log(fileUpload);
    
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error:any) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    // blobStream.on('finish', () => {
    //   // The public URL can be used to directly access the file via HTTP.
    //   const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
    //   resolve(url);
    // });

    blobStream.end(file.buffer);
  });
}
// 3010 포트로 서버 실행
app.listen(3001, () => {
  console.log('실행중');
});
