'use strict';

const express = require(`express`);
const path = require(`path`);
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);
const authRoutes = require(`./routes/authentication`);
const sequelize = require(`../service/lib/sequelize`);
const sessionStore = require(`../service/lib/session-store`);

const DEFAULT_PORT = 8081;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();
sessionStore(sequelize, app);

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

(async () => {
  await sequelize.sync({force: true});
})();
