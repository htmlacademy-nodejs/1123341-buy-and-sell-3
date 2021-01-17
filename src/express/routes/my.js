'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

// путь в res.render(``) прописываем так, как будто мы находимся в файле index.js
myRouter.get(`/`, (req, res) => res.render(`my-tickets`));
myRouter.get(`/comments`, (req, res) => res.render(`comments`));

module.exports = myRouter;
