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

      // При `raw: true` запрос вернёт массив «голых» данных, т.е. SQL-команды,
      // которые сработали при работе sequelize.
      // При `raw: false` запрос вернёт массив объектов-обёрток, тогда
      // мы сможем применить метод get()
    });

    return offers.map((offer) => offer.get());
  }

}

module.exports = SearchService;
