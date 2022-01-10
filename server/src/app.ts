import express from "express"
import "firebase/compat/auth";
import { deletePostAdmin, uploadImageAdmin, uploadImageToStorage } from "./service/firebaseAdmin/firebaseAdmin";

const app: express.Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage()
});

app.post("/uploadpost", upload.any(), (req: any, res: express.Response) => {

  const parsedUserInfo = JSON.parse(req.body.userInfo)
  const paredPostSetChanged = JSON.parse(req.body.postSetChanged);
  const location = JSON.parse(req.body.location)

  const tmp = []

  for (let i = 0; i < location.length; i++) {
    const element = location[i];
    tmp.push(req.files[element])
  }
  uploadImageToStorage(tmp, parsedUserInfo.email).then((resArr: any) => {
    uploadImageAdmin(req.body.caption, resArr, parsedUserInfo, req.body.category)
      .then(() => {
      const Response = {
        alert: [true, "Upload", "success"],
        loading: false,
        postSetChanged: ["upload", !paredPostSetChanged[1]]
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
})

app.post("/deletepost", (req: any, res: express.Response) => {
  deletePostAdmin(req.body.docId, req.body.email, req.body.storageImageNameArr).then(() => {
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

app.listen(3001,() => {
  console.log('Server Operated!');
});
