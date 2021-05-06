'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const jwt = require(`jsonwebtoken`);
const {nanoid} = require(`nanoid`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;
const path = require(`path`);
const api = require(`../api`).getAPI();
const formReliability = require(`../../service/middlewares/form-reliability`);
const authenticateJwt = require(`../../service/middlewares/authenticateJwt`);
const {makeTokens} = require(`../../service/lib/jwt-helper`);

const UPLOAD_DIR = `../upload/img/`;
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, DB_FORM_RELIABILITY} = process.env;
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

module.exports = (app, refreshTokenService) => {
  const authRouter = new Router();
  app.use(`/`, authRouter);

  // Регистрация
  authRouter.get(`/sign-up`, (req, res) => {
    res.render(`sign-up`);
  });

  // // Обработка регистрационной формы
  authRouter.post(`/sign-up`, upload.single(`user-avatar`), async (req, res) => {
    const {body, file} = req;
    const userData = {
      userAvatar: file ? file.filename : ``,
      userName: body[`user-name`],
      email: body[`user-email`],
      password: body[`user-password`],
      repeat: body[`user-password-again`]
    };

    try {
      await api.createUser(userData);
      res.redirect(`/login`);

    } catch (error) {
      let {data: details} = error.response;
      details = Array.isArray(details) ? details : [details];

      res.render(`sign-up`, {
        errorsMessages: details.map((errorDescription) => errorDescription.message)}
      );

      return;
    }
  });

  // Вход на сайт
  authRouter.get(`/login`, async (req, res) => {
    const hashedValue = await bcrypt.hash(DB_FORM_RELIABILITY, saltRounds);
    res.render(`login`, {hashedValue});
  });

  authRouter.post(`/login`, upload.none(), formReliability, async (req, res) => {
    const {body} = req;
    const formData = {
      email: body[`user-email`],
      password: body[`user-password`],
    };

    try {
      const loggedUser = await api.loginUser(formData); // как будто данные из строки таблицы Users
      const tokenByUser = await refreshTokenService.find(loggedUser.id); // экземпляр модели RefreshToken

      if (tokenByUser) {
        const {token} = tokenByUser;
        const userData = jwt.verify(token, JWT_REFRESH_SECRET); // получаем раздекодированные данные, если токен успешно верифицирован
        const {id} = userData; // вычленяем id пользователя

        const {accessToken, refreshToken} = makeTokens({
          id,
          userAvatar: loggedUser.userAvatar,
          isLogged: true
        });

        await refreshTokenService.delete(id);
        await refreshTokenService.add(id, refreshToken);

        res.cookie(`authorization`, accessToken);

      } else {
        const {accessToken, refreshToken} = makeTokens({
          id: loggedUser.id,
          userAvatar: loggedUser.userAvatar,
          isLogged: true
        });

        await refreshTokenService.add(loggedUser.id, refreshToken);
        res.cookie(`authorization`, accessToken);
      }

      res.redirect(`/`);

    } catch (error) {
      let {data: details} = error.response;
      details = Array.isArray(details) ? details : [details];
      const hashedValue = await bcrypt.hash(DB_FORM_RELIABILITY, saltRounds);

      res.render(`login`, {
        errorsMessages: details.map((errorDescription) => errorDescription.message),
        hashedValue
      });

      return;
    }
  });

  authRouter.get(`/logout`, authenticateJwt, async (req, res) => {
    const token = req.cookies[`authorization`];
    const userData = jwt.verify(token, JWT_ACCESS_SECRET);
    const {id} = userData;
    refreshTokenService.delete(id);
    res.redirect(`/login`);
  });
};
