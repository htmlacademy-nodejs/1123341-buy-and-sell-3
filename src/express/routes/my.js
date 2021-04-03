'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

// путь в res.render(``) прописываем так, как будто мы находимся в файле index.js
myRouter.get(`/`, async (req, res) => {
  const proposals = await api.getOffers();
  res.render(`my-tickets`, {proposals});
});

// нам нужны комментари только первых 3 офферов
myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});
  res.render(`comments`, {proposals: offers.slice(0, 3)});
});

module.exports = myRouter;
