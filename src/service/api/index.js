'use strict';
// Здесь происходит регистрация маршрутов;

const {Router} = require(`express`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

// асинхронность нужна, чтобы сначала получить данные, а потом запустить контроллеры
(async () => {
  // ждем получения моковых данных Promise.resolve(data)
  const mockData = await getMockData();

  // запускаем контроллеры
  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  offer(app, new OfferService(mockData), new CommentService());
})();

module.exports = app;
