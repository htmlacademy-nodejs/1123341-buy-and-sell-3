'use strict';
// Здесь происходит регистрация маршрутов;

const {Router} = require(`express`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);
const user = require(`../api/user`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
  UserService,
  RefreshTokenService
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const routes = new Router();

// инициирует создание таблиц
defineModels(sequelize);

(() => {
  category(routes, new CategoryService(sequelize));
  search(routes, new SearchService(sequelize));
  offer(routes, new OfferService(sequelize), new CommentService(sequelize));
  user(routes, new UserService(sequelize));
})();

module.exports = {
  routes,
  refreshTokenService: new RefreshTokenService(sequelize)
};
