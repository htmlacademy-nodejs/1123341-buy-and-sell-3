'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

// маршрут оборачиваем в функцию
// в offerService прилетает экземпляр класса
module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.find();
    res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    // объекты req.body и res.body не содержат id
    const offer = offerService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(offer); // отправляем запрашивающей стороне ответ (offer) в формате json
  });

  // редактируем публикацию
  route.put(`/:offerId`, offerValidator, (req, res) => {
    const {offerId} = req.params;
    const existOffer = offerService.findOne(offerId);

    if (!existOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    const updatedOffer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.delete(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  // существование публикации проверяем в offerExist(offerService)
  // если не существует, то не запустится next()
  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const comments = commentService.find(offer);

    res.status(HttpCode.OK)
      .json(comments);

  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(offer, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    // пушим новый коммент в массив комментов
    // возвращаем новый коммент
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
