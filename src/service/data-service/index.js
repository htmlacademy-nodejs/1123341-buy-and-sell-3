'use strict';

// Сервисы извлекают данные из БД
// Внутри методов этих сервисов используем методы моделей sequelize
const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const OfferService = require(`./offer`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);
const RefreshTokenService = require(`./refresh-token`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  OfferService,
  UserService,
  RefreshTokenService
};
