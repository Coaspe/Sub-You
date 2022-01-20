import express from "express"
import "firebase/compat/auth";
import { clearInterval } from "timers";
import { deletePostAdmin, uploadImageAdmin, uploadImageToStorage, updateTime, endAuction, addComment } from "./service/firebaseAdmin/firebaseAdmin";

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

app.post("/makeauction", (req: any, res: express.Response) => {
  let minute = 30
  let second = 0
  console.log(req.body.auctionKey);

  function tik () {
    second = second - 1 < 0 ? 59 : second - 1
    minute = second === 59 ? minute - 1 : minute
    updateTime(req.body.auctionKey, `${minute.toString()} : ${second.toString()}`)
  }

  let timer = setInterval(tik, 1000)

  setTimeout(function() {
    clearInterval(timer)
    endAuction(req.body.auctionKey)
    res.end()
  }, 1800000)

})

app.post("/addcomment", (req: any, res: express.Response) => {
  const comment = {
    text: req.body.text,
    userUID: req.body.userUID,
    postDocID: req.body.postDocID,
    userProfileImg: req.body.userProfileImg,
    username: req.body.username,
    reply: [],
    dateCreated: new Date().getTime(),
    likes:0
  }
  addComment(
    comment.text,
    comment.userUID,
    comment.postDocID,
    comment.userProfileImg,
    comment.username,
    comment.dateCreated
  ).then(() => {
    res.send(comment)
    res.end()
  })
})

app.listen(3001,() => {
  console.log('Server Operated!');
});
