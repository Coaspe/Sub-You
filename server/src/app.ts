import express from "express"
import "firebase/compat/auth";
import {
  updateProfileWithoutImage,
  deletePostAdmin,
  uploadImageAdmin,
  uploadImageToStorage,
  endAuction,
  addComment,
  updateProfileWithImage,
  deleteComment,
  makeAuction,
  makeTransaction,
  participateInAuction
} from "./service/firebaseAdmin/firebaseAdmin";

const app: express.Express = express()
// json request body를 받기 위해 사용한다. application/json
app.use(express.json())
// json request body를 받기 위해 사용한다. application/x-www-form-urlencoded
// &으로 분리되고, "=" 기호로 값과 키를 연결하는 key-value tuple로 인코딩되는 값입니다. 
// 영어 알파벳이 아닌 문자들은 percent encoded 으로 인코딩됩니다.
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

const moment = require('moment')

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
    uploadImageAdmin(req.body.caption, resArr, parsedUserInfo, req.body.category, JSON.parse(req.body.averageColor))
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
      alert: [true, "Post Delete", "success"],
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
})

app.post("/makeAuction", (req: any, res: express.Response) => {

  const endTime = moment().add(30, "minutes").valueOf()
  const key = makeAuction(req.body.sellerUid, req.body.photoURL, req.body.firstPrice, endTime, res)
  
  if (key === -1) {
    res.send("Error")
    res.end()
  } else {
    setTimeout(() => {
      endAuction(key)
      res.send("Auction Completed")
      res.end()
    }, 1800000)
  
  }
})
app.post("/makeTransaction", (req: any, res: express.Response) => {
  console.log(makeTransaction(req.body.buyerUid, req.body.price, req.body.auctionKey, res))
})

app.post("/participateInAuction", (req: any, res: express.Response) => {
  participateInAuction(req.body.buyerUid, req.body.price, req.body.auctionKey, res)
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
    likes:[]
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
app.post("/deleteComment", (req: any, res: express.Response) => {
  deleteComment(req.body.postDocID, req.body.commentDocID).then(() => {
    const Response = {
      alert: [true, "Comment Delete", "success"],
    }
    res.send(JSON.stringify(Response))
    res.end()
  }).catch((error) => {
    console.log(error);
    const Response = {
      alert: [true, "Comment Delete", "error"],
    }
    res.send(JSON.stringify(Response))
    res.end()
  })

})
app.post("/updateProfileWithImage", upload.single("file"), (req: any, res: express.Response) => {
  updateProfileWithImage(req.body.userEmail, req.body.profileCaption, req.file, req.body.username).then(() => {
    res.end()
  }).catch((err: any) => {
    console.log(err.message);
  })
})

app.post("/updateProfileWithoutImage", (req: any, res: express.Response) => {
  updateProfileWithoutImage(req.body.userEmail, req.body.profileCaption, req.body.username).then(() => {
    res.end()
  }).catch((err: any) => {
    console.log(err.message);
  })
})

app.listen(3001, () => {
  console.log('Server Operated!');
  moment.locale()
  console.log(moment().format('LTS'));
});
