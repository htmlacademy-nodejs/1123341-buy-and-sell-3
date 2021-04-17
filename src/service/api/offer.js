'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemeValidator = require(`../middlewares/scheme-validator`);
const offerScheme = require(`../middlewares/schemes/offer-scheme`);
const commentScheme = require(`../middlewares/schemes/comment-scheme`);
const offerExist = require(`../middlewares/offer-exists`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;

    if (limit || offset) {
      // Фронтенд запрашивает 3 страницу http://localhost:8081/?page=3
      // Бэкэнд запрашивает http://localhost:3001/api/offers?offset=16&limit=8
      result = await offerService.findPage({limit, offset});

    } else {
      result = await offerService.findAll(comments);
    }
    res
      .status(HttpCode.OK)
      .json(result);
  });

  route.get(`/:offerId`, async (req, res) => {
    // Например, запрос http://localhost:3001/api/offers/3?comments=tyo
    const {offerId} = req.params; // offerId === 3
    const {comments} = req.query; // comments === tyo

    const offer = await offerService.findOne(offerId, comments);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.post(`/`, schemeValidator(offerScheme), async (req, res) => {
    // В объекте req.body свойство categories в виде [1, 2](пример)
    // В offer нет свойства categories, т.к. метод create
    // под капотом назначает связи через sequelize в Postgres: offers с categories
    const offer = await offerService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  // редактируем публикацию
  route.put(`/:offerId`, schemeValidator(offerScheme), async (req, res) => {
    const {offerId} = req.params;
    const updated = await offerService.update(offerId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }
    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.drop(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offerId} = req.params;
    const comments = await commentService.findAll(offerId);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deleted);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), schemeValidator(commentScheme)], (req, res) => {
    const {offerId} = req.params;
    const comment = commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
