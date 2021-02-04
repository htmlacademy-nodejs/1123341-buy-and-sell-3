'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

// маршрут оборачиваем в функцию
module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const categories = await service.find();
    res.status(HttpCode.OK) // OK: 200
      .json(categories);
  });
};
