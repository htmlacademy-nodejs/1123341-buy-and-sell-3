"use strict";

const Sequelize = require(`sequelize`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;
const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

module.exports = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`, // указываем, с какой СУБД предстоит работать
      pool: {
        max: 5, // Максимальное количество подключений в пуле
        min: 0, // Минимальное количество подключений в пуле
        acquire: 10000, // Максимальное время (мсек), в течение которого пул будет пытаться установить соединение до выдачи ошибки.
        idle: 10000 // Максимальное время (мсек), в течение которого соединение может находиться в режиме ожидания перед освобождением.
      }
    }
);
