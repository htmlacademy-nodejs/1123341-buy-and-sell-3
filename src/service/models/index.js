"use strict";

const {Model} = require(`sequelize`);

// В трех случаях экспортируем ф-ю define, которая принимает в качестве параметра экземпляр sequelize,
// и уже затем вызывает Category.init.
const defineCategory = require(`./category`); // 1
const defineComment = require(`./comment`); // 2
const defineOffer = require(`./offer`); // 3

const Aliase = require(`./aliase`);
class OfferCategory extends Model {}

// Описание связей
const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);

  // В таблице сomments столбец offer_id
  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  OfferCategory.init({}, {sequelize});

  // through задает имя вспомогательной таблицы, через которую задается многие ко многим
  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES}); // зачем?????????????

  // Вернём классы наших сущностей
  return {Category, Comment, Offer, OfferCategory};
};

module.exports = define;
