'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

// путь в res.render(``) прописываем так, как будто мы находимся в файле index.js
mainRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`main`, {offers});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    // в search попадает то, что вбито в поисковик
    // search - это значение атрибута name
    const {search} = req.query;
    // в results попадают офферы, удовлетворяющие поисковому запросу
    const results = await api.search(search);

    res.render(`search-result`, {
      results
    });

  } catch (error) {
    res.render(`search-result`, {
      results: []
    });
  }
});

module.exports = mainRouter;
