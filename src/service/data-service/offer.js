'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(offerData) {
    // offer - аналог записи, типа INSERT INTO в SQL-запросе.
    // Автом. присваиваются: id, updatedAt, createdAt. Нет categories
    // offer instanceof this._Offer
    const offer = await this._Offer.create(offerData);

    // В таблице OfferCategories нашему автоматически сформированному OfferId
    // присваиваются CategoryId, которые отправил пользователь.
    await offer.addCategories(offerData.categories);
    
    // Выглядит как объект, полученный от клиента, НО
    // Нет свойства categories, есть - id, updatedAt, createdAt.
    return offer.get();
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    // если мы указали явно, хотим ли мы получить offers с комментами
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const offers = await this._Offer.findAll({include});
    return offers.map((item) => item.get());
  }

  findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    // neededOffer instanceof this._Offer
    const neededOffer = this._Offer.findByPk(id, {include});
    return neededOffer;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit, // кол-во объявлений на странице (название из SQL)
      offset, // ...начиная с offset (название из SQL)
      include: [Aliase.CATEGORIES],
      distinct: true
    });

    // count - общее количество объявлений; rows - содержимое текущей страницы
    return {count, offers: rows};
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = OfferService;
