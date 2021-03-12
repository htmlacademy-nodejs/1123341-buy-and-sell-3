"use strict";

const path = require(`path`);
const pino = require(`pino`);
const {Env} = require(`../../constants`);

const LOG_FILE = path.resolve(__dirname, `../../../logs/api.log`);
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

// если process.env.NODE_ENV === `developmnet`, то defaultLogLevel === `info`
// если process.env.NODE_ENV === `production`, то defaultLogLevel === `error`
const defaultLogLevel = isDevMode ? `info` : `error`;

// конфигуратор логгера
const logger = pino(
    {
      name: `base-logger`,
      level: process.env.LOG_LEVEL || defaultLogLevel,
      prettyPrint: isDevMode
    },
    // если process.env.NODE_ENV === `production`
    // тогда логи сохранять в api.log
    isDevMode ? process.stdout : pino.destination(LOG_FILE)
);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};

