'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findAll(searchText) {
    const offers = await this._Offer.findAll({
      // Условие как в SQL
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      // как будто LEFT OUTER JOIN "categories" AS "categories"
      include: [Aliase.CATEGORIES],
    });

    return offers.map((offer) => offer.get());
  }
}

module.exports = SearchService;
