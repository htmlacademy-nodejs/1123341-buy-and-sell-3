"use strict";

const sequelize = require(`./sequelize`);
const expressSession = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);

module.exports = new SequelizeStore({
  db: sequelize, // конектор к базе данных
  expiration: 180000, // максимальное время жизни сессии в миллисекундах
  checkExpirationInterval: 60000, // Временной интервал проверки и удаления устаревших сессий.
  // tableName: `Sessions` - название таблицы с сессиями по умолчанию
});
