'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

// путь в res.render(``) прописываем так, как будто мы находимся в файле index.js
mainRouter.get(`/`, (req, res) => res.render(`main`));
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, (req, res) => res.render(`search-result`));

module.exports = mainRouter;
