"use strict";

const pino = require(`pino`);

// конфигуратор логгера
const logger = pino({
  name: `base-logger`,
  level: `info`,
  prettyPrint: true // Теперь pino автоматически станет использовать pino-pretty для форматирования логов
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
