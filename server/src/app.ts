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
  
  uploadImageAdmin(req.body.caption, req.body.ImageUrl, req.body.userInfo, req.body.category)
    .then(() => {
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
