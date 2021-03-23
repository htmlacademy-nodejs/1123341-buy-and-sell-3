'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  // Вместо объекта с данными в конструктор передаём экземпляр sequelize
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  // Получим данные из БД. Метод возвращает промис.
  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        // какие столбцы будут в результирующей таблице
        attributes: [
          `id`,
          `name`,

          // Создаем новый столбец `count`.
          // COUNT - агрегирующая функция для сгрупированных строк(см.ниже gorup)
          [Sequelize.fn(`COUNT`, `*`), `count`]
        ],

        // Объявления с одинаковой категорией(т.е. Category.id) группируются
        group: [Sequelize.col(`Category.id`)],

        // подгружаем данные из таблицы связей
        include: [{
          model: this._OfferCategory,
          as: Aliase.OFFER_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());

    } else {
      return this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
