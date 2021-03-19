'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

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

      // result - это массив экземпляров модели Category, т.к. "raw: false".
      // return возвращает массив объектов(необработанных данных), типа {id: 3, name: `Книги`, count: 3}.
      return result.map((it) => it.get());

    } else {
      // result - это массив объектов, типа {id: 3, name: `Книги`, createdAt: ``, updatedAt: ``}
      // Каждый объект из этого массива - это строка результата SQL-запроса
      const result = this._Category.findAll({raw: true});
      return result;
    }
  }
}

module.exports = CategoryService;

