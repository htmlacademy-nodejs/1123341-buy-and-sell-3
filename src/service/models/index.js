"use strict";

const {Model} = require(`sequelize`);

// Импортируемые функции при вызове инициируют модели
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineUser = require(`./user`);
const defineRefreshToken = require(`./refresh-token`);

// Алиас — это особое имя, которое даётся для связи между сущностями.
// Позволяет задать несколько разных связей между одной и той же парой сущностей.
const Aliase = require(`./aliase`);
class OfferCategory extends Model {}

// Описание связей внутри данной функции
// Возвращает классы(таблицы)
const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const User = defineUser(sequelize);
  const RefreshToken = defineRefreshToken(sequelize);

  User.hasOne(RefreshToken, {foreignKey: `userId`});
  RefreshToken.belongsTo(User, {foreignKey: `userId`});

  // В таблице сomments столбец offer_id
  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  OfferCategory.init({}, {sequelize});

  // through задает имя вспомогательной таблицы, через которую задается многие ко многим.
  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES}); // OfferCategory is not associated to Offer
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES}); // зачем???????

  return {Category, Comment, Offer, User, OfferCategory, RefreshToken};
};

module.exports = define;
