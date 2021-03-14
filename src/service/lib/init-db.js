"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, offers}) => {
  const {Category, Offer} = defineModels(sequelize); // а где Comment и OfferCategory????????????
  await sequelize.sync({force: true});

  // -------------------------------------------------
  // Ниже могу использовать:
  // offers, categories - это просто массивы с данными
  // Category, Offer - это классы сущностей из models
  // -------------------------------------------------

  // Запишем в таблицу все категории, а id выбирается автоматически
  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {}); // объяснение в utils


  const offerPromises = offers
    .map(async (offer) => {
      // Без include запишет в БД объявления, но не комментарии.
      // Offer.hasMany(Comment... && Comment.belongsTo(Offer...
      // include не устанавливает связи с существующими записямии.
      const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});

      // Здесь связи многие-ко-многим и есть промеж. таблица.
      await offerModel.addCategories(
          offer.categories.map((name) => categoryIdByName[name])
      );
    });

  // offerPromises - массив промисов, у которых resolve(undefined)
  await Promise.all(offerPromises); // [undefined, undefined...]
};
