"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("firebase/compat/auth");
const firebaseAdmin_1 = require("./service/firebaseAdmin/firebaseAdmin");
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
    if (req.body.userEmail === undefined) {
        res.sendStatus(404);
        res.send("User Email Error!");
        res.end();
    }
    (0, firebaseAdmin_1.uploadImageToStorage)(req.files, req.body.userEmail).then((resArr) => {
        res.send(JSON.stringify(resArr));
        res.end();
    });
});
app.post("/uploadpostFinish", (req, res) => {
    if (req.body === {}) {
        res.sendStatus(404);
        res.send("User Email Error!");
        res.end();
    }
    (0, firebaseAdmin_1.uploadImageAdmin)(req.body.caption, req.body.ImageUrl, req.body.userInfo, req.body.category)
        .then(() => {
        const Response = {
            alert: [true, "Upload", "success"],
            loading: false,
            postSetChanged: ["upload", !req.body.postSetChanged[1]]
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
app.listen(3001, () => {
    console.log('Server Operated!');
});