'use strict';
// Здесь происходит регистрация маршрутов;

const {Router} = require(`express`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

// инициирует создание таблиц
defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  offer(app, new OfferService(sequelize), new CommentService(sequelize));
})();

module.exports = app;


