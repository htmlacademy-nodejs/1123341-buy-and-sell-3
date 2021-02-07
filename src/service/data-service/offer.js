'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  // актуализируем массив this._offers
  // возвращаем новый offer с ключом "id"
  create(offer) {
    const newOffer = {
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
      ...offer
    };

    this._offers.push(newOffer);
    return newOffer;
  }

  // возвращаем либо null, либо удаленный offer
  delete(id) {
    // находим offer по "id"
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      return null; // нет offer - возвращаем null
    }

    // оставляет те offers, у кого не совпадает "id" c аргументом
    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  find() {
    return this._offers;
  }

  // получить данные только для определённого объявления
  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this._offers
      .find((item) => item.id === id);

    return Object.assign(oldOffer, offer);
  }
}

module.exports = OfferService;
