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
          [Sequelize.fn(`COUNT`, `*`), `count`] // ????????создаем новый столбец по имени `count`. Дальше воспользуемся Sequelize.fn и применим агрегирующую функцию COUNT к сгруппированным строкам. В результате в столбце count окажется количество строк с данным id категории. А это то же самое, что количество объявлений в данной категории.
        ],
        group: [Sequelize.col(`Category.id`)], // ??????????группируем строки сводной таблицы, с одинаковыми Category.id.

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
