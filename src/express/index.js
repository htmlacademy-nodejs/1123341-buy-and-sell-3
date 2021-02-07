'use strict';

const express = require(`express`);
const path = require(`path`); // предоставляет утилиты для работы с путями к файлам и директориям
const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express(); // инициализируем новое веб-приложение (функция)

app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

// встроенный middleware static передает клиенту статические ресурсы
// в path.resolve(__dirname, PUBLIC_DIR) получаем (см. ниже)
// C:\Users\Lenovo\Desktop\1123341-buy-and-sell-3\src\express\public
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));


// если синтаксис запроса некорректен, то выбрасываем ошибку
app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, _req, res, _next) => res.status(500).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`)); // указываем директорию с шаблонами
app.set(`view engine`, `pug`); // название шаблонизатора

app.listen(DEFAULT_PORT);
