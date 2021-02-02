"use strict";

const pino = require(`pino`);

const logger = pino({
  name: `base-logger`,
  level: `info`,
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
