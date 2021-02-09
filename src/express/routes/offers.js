'use strict';

const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const offersRouter = new Router();
const api = require(`../api`).getAPI();

// путь в res.render(``) прописываем так, как будто мы находимся в файле index.js
offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories});
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;
