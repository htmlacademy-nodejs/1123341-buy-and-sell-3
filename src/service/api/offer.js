'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    // ??????? offset, limit
    const {offset, limit, comments} = req.query;
    let result;

    if (limit || offset) {
      result = await offerService.findPage({limit, offset});

    } else {
      result = await offerService.findAll(comments);
    }
    res.status(HttpCode.OK).json(result);
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

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer); // отправляем запрашивающей стороне ответ (offer) в формате json
  });

  // редактируем публикацию
  route.put(`/:offerId`, offerValidator, async (req, res) => {
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

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals; // ??????? offer всегда undefined
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
