"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("firebase/compat/auth");
const timers_1 = require("timers");
const firebaseAdmin_1 = require("./service/firebaseAdmin/firebaseAdmin");
const app = (0, express_1.default)();
// json request body를 받기 위해 사용한다. application/json
app.use(express_1.default.json());
// json request body를 받기 위해 사용한다. application/x-www-form-urlencoded
// &으로 분리되고, "=" 기호로 값과 키를 연결하는 key-value tuple로 인코딩되는 값입니다. 
// 영어 알파벳이 아닌 문자들은 percent encoded 으로 인코딩됩니다.
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});
app.post("/uploadpost", upload.any(), (req, res) => {
    const parsedUserInfo = JSON.parse(req.body.userInfo);
    const paredPostSetChanged = JSON.parse(req.body.postSetChanged);
    const location = JSON.parse(req.body.location);
    const tmp = [];
    for (let i = 0; i < location.length; i++) {
        const element = location[i];
        tmp.push(req.files[element]);
    }
    (0, firebaseAdmin_1.uploadImageToStorage)(tmp, parsedUserInfo.email).then((resArr) => {
        (0, firebaseAdmin_1.uploadImageAdmin)(req.body.caption, resArr, parsedUserInfo, req.body.category, JSON.parse(req.body.averageColor))
            .then(() => {
            const Response = {
                alert: [true, "Upload", "success"],
                loading: false,
                postSetChanged: ["upload", !paredPostSetChanged[1]]
            };
            res.send(JSON.stringify(Response));
            res.end();
        }).catch((error) => {
            console.log(error);
            const Response = {
                alert: [true, "Upload", "error"],
                loading: false,
                error: error
            };
            res.send(JSON.stringify(Response));
            res.end();
        });
    });
});
app.post("/deletepost", (req, res) => {
    (0, firebaseAdmin_1.deletePostAdmin)(req.body.docId, req.body.email, req.body.storageImageNameArr).then(() => {
        const Response = {
            alert: [true, "Delete", "success"],
            postSetChanged: ["delete", !req.body.postSetChanged[1]],
            loading: false
        };
        res.send(JSON.stringify(Response));
        res.end();
    }).catch((err) => {
        console.log(err.message);
        const Response = {
            alert: [true, "Delete", "error"],
            loading: false
        };
        res.send(JSON.stringify(Response));
        res.end();
    });
});
app.post("/makeauction", (req, res) => {
    let minute = 30;
    let second = 0;
    console.log(req.body.auctionKey);
    function tik() {
        second = second - 1 < 0 ? 59 : second - 1;
        minute = second === 59 ? minute - 1 : minute;
        (0, firebaseAdmin_1.updateTime)(req.body.auctionKey, `${minute.toString()} : ${second.toString()}`);
    }
    let timer = setInterval(tik, 1000);
    setTimeout(function () {
        (0, timers_1.clearInterval)(timer);
        (0, firebaseAdmin_1.endAuction)(req.body.auctionKey);
        // get last buy request and pay
        res.end();
    }, 1800000);
});
app.post("/addcomment", (req, res) => {
    const comment = {
        text: req.body.text,
        userUID: req.body.userUID,
        postDocID: req.body.postDocID,
        userProfileImg: req.body.userProfileImg,
        username: req.body.username,
        reply: [],
        dateCreated: new Date().getTime(),
        likes: []
    };
    (0, firebaseAdmin_1.addComment)(comment.text, comment.userUID, comment.postDocID, comment.userProfileImg, comment.username, comment.dateCreated).then(() => {
        res.send(comment);
        res.end();
    });
});
app.post("/updateProfile", upload.single('file'), (req, res) => {
    console.log(req.file);
    (0, firebaseAdmin_1.updateProfile)(req.body.userUID, req.body.userEmail, req.body.profileCaption, req.file, req.body.username);
});
app.listen(3001, () => {
    console.log('Server Operated!');
});
