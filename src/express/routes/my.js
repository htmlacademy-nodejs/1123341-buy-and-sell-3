'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

// путь в res.render(``) прописываем так, как будто мы находимся в файле index.js
myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`my-tickets`, {offers});
});

// комментарии к первым 3 публикациям с ресурса /api/offers/:offerId/comments;
myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`comments`, {offers: offers.slice(0, 3)});
});

module.exports = myRouter;
