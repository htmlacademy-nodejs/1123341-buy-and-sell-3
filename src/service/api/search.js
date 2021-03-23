'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

// маршрут оборачиваем в функцию
module.exports = (app, service) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    // http://localhost:3000/api/search?query=Название титула объявления
    const {query = ``} = req.query;
    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    // query - текст запроса
    const searchResults = await service.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });
};
