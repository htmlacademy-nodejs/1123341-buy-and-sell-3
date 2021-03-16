'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findAll(searchText) {
    const offers = await this._Offer.findAll({
      // Условие
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES],

      // ???????? убрать потом raw. Без опции raw запрос вернёт не массив «голых» данных, а массив объектов-обёрток
      // Один из них — get. Он позволяет получить необработанные данные
      // raw: true
    });

    // что делает метод get??????????
    return offers.map((offer) => offer.get());
  }

}

module.exports = SearchService;
