'use strict';

const expressSession = require(`express-session`);
const sequelize = require(`../lib/sequelize`);

const {DB_SECRET_SESSION} = process.env;

module.exports = async (express) => {
  const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);

  const mySessionStore = new SequelizeStore({
    db: sequelize, // конектор к базе данных
    expiration: 180000, // максимальное время жизни сессии в миллисекундах
    checkExpirationInterval: 60000, // Временной интервал проверки и удаления устаревших сессий.
    // tableName: `Sessions` - название таблицы с сессиями по умолчанию
  });

  express.use(expressSession({
    store: mySessionStore,
    secret: DB_SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    name: `session_id`
  }));

  (async () => {
    await sequelize.sync({force: true});
  })();
};
