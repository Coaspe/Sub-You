"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("firebase/compat/auth");
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// const formidable = require('express-formidable');
// app.use(formidable());
const Busboy = require('busboy');
app.use(Busboy({ headers: { "Content-Type": "multipart/form-data" } }));
app.post("/uploadpost", (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(file);
    });
});
// app.get('/', (req: express.Request, res: express.Response) => {
//   res.send('hello express');
// });
// app.get('/tryGoogleLogin', (req: express.Request, res: express.Response) => {
//   try {
//     console.log("saefsef");
//     signInWithGoogle()
//     }
//   catch (err) {
//     console.log(err);
//   }
//   res.send("Welcome !!")
// });
// app.get('/posts', (req: express.Request, res: express.Response) => {
//   res.json([
//     { id: 1, content: 'hello' },
//     { id: 2, content: 'hello2' },
//     { id: 3, content: 'hello3' },
//   ]);
// });
// 3010 포트로 서버 실행
app.listen(3001, () => {
    console.log('실행중');
});
