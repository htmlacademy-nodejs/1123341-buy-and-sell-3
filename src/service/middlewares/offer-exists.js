'use strict';

const {HttpCode} = require(`../../constants`);

// в service подставляем класс
module.exports = (service) => (req, res, next) => {
  const {offerId} = req.params;

  // Проверяем наличие объявления по идентификатору.
  const offer = service.findOne(offerId);

  if (!offer) {
    res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${offerId} not found`);

  } else {
    // сохраняем объявление в объекте locals
    res.locals.offer = offer;
    next();
  }
};
