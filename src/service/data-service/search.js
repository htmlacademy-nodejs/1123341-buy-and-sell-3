'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  find(searchText) {
    // возвращает массив с элементами
    // у которых текст title === тексту searchText
    return this._offers.
      filter((offer) => offer.title.includes(searchText));
  }
}

module.exports = SearchService;
