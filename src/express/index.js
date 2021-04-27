'use strict';

const express = require(`express`);
const expressSession = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const path = require(`path`);
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);
const authRoutes = require(`./routes/authentication`);
const sequelize = require(`../service/lib/sequelize`);
const {DB_SECRET_SESSION} = process.env;

const DEFAULT_PORT = 8081;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);
const mySessionStore = new SequelizeStore({
  db: sequelize, // конектор к базе данных
  expiration: 180000, // максимальное время жизни сессии в миллисекундах
  checkExpirationInterval: 60000, // Временной интервал проверки и удаления устаревших сессий.
  // tableName: `Sessions` - название таблицы с сессиями по умолчанию
});

const app = express();
app.use(cookieParser(`secret key`));

app.use(expressSession({
  store: mySessionStore,
  secret: DB_SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  name: `session_id`
}));

app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);
app.use(`/`, authRoutes);

// встроенный middleware static передает клиенту статические ресурсы
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

// Чтобы изображения, сохранённые нами, могли отображаться в объявлениях на странице так же,
// как и изображения из src/express/public
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

// если синтаксис запроса некорректен, то выбрасываем ошибку
app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, `templates`)); // указываем директорию с шаблонами
app.set(`view engine`, `pug`); // название шаблонизатора

app.listen(DEFAULT_PORT);
