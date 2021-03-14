'use strict';

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  // offerId - внешний ключ в таблице comments для связи с id в offers.
  // В методе: получаем объект-обертку offer и запрос для создания комментария
  create(offerId, comment) {
    return this._Comment.create({
      offerId,
      ...comment
    });
  }

  async drop(id) {
    // destroy возвращает количество удалённых записей.
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    // true/false, если deletedRows === число/0
    return !!deletedRows;
  }

  findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }

}

module.exports = CommentService;
