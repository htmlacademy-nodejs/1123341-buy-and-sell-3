'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers; // массив информации с объявлениями.
  }

  // формирование массива всех категорий для которых есть объявления;
  // Нет смысла возвращать одинаковые имена категорий.
  findAll() {
    const categories = this._offers.reduce((acc, offer) => {
      acc.add(...offer.category);
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
