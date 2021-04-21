'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const authRouter = new Router();
const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

// Регистрация
authRouter.get(`/sign-up`, (req, res) => {
  res.render(`sign-up`);
});

// // Обработка регистрационной формы
authRouter.post(`/sign-up`, upload.single(`avatar`), async (req, res) => {
});

// // Вход на сайт
// authRouter.get(`/login`, async (req, res) => {
// });

// // Обработка формы «Вход»
// authRouter.post(`/login`, async (req, res) => {
// });

// // Выход
// authRouter.get(`/logout`, async (req, res) => {
// });

module.exports = authRouter;
