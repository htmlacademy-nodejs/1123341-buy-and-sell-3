'use strict';

const {HttpCode} = require(`../../constants`);
const offerKeys = [`categories`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);

  // сравниваем ключи полученного объекта с эталонным списком БЕЗ "id"
  const keysExists = offerKeys.every((key) => keys.includes(key));

  // Если какого-то ключа нет, то просто вернём клиенту код 400 (ошибка в запросе)
  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);

  } else {
    next();
  }
};
