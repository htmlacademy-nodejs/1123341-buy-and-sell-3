'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers; // массив информации с объявлениями.
  }

  // формирование массива всех категорий для которых есть объявления;
  // Нет смысла возвращать одинаковые имена категорий.
  findAll() {
    const categories = this._offers
      .flatMap((offer) => offer.category);

    return new Set(categories);
  }
}

module.exports = CategoryService;
