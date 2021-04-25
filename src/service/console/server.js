'use strict';

const express = require(`express`);
const expressSession = require(`express-session`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const {DB_SECRET_SESSION} = process.env;

// Значение может быть любым в пределах от 0 до 65535
// но лучше не использовать диапазон от 0 до 1023
// не использовать список зарегестрированных в IANA
const DEFAULT_PORT = 3001;

const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);
const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize, // конектор к базе данных
  expiration: 180000, // максимальное время жизни сессии в миллисекундах
  checkExpirationInterval: 60000, // Временной интервал проверки и удаления устаревших сессий.
  // tableName: `Sessions` - название таблицы с сессиями по умолчанию
});

app.use(express.json());

app.use(expressSession({
  store: mySessionStore,
  secret: DB_SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  name: `session_id`
}));

// в консольном выводе (в объекте) при вызове методов логгера будет ключ name со значением `api`
const logger = getLogger({name: `api`});

app.use((req, res, next) => {
  logger.debug(`Запрос по адресу ${req.url}`);

  // Событие finish не означает, что клиент что-то получил.
  // Событие происходит, когда "last segment of the response headers and body"
  // переданы операционной системе для передачи по сети.
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Маршрут не найден: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`Ошибка при обработке запроса: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();

    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occured on server creation: ${err.message}`);
        }

        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
  }
};
