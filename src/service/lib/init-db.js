"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, offers}) => {
  const {Category, Offer} = defineModels(sequelize); // а где Comment и OfferCategory????????????
  await sequelize.sync({force: true});

  // ________________________________________
  // Ниже могу использовать:
  // offers, categories - это просто массивы с данными
  // Category, Offer - это классы сущностей из models
  // ________________________________________


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
      // Без include запишет в БД объявления, но не комментарии
      const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});

      // include не сработает с категориями. Категории — это уже существующие записи.
      // На текущий момент Sequelize умеет создавать связанные записи при создании основной,
      // но не устанавливать связи с существующими записями.
      await offerModel.addCategories(
          offer.categories.map((name) => categoryIdByName[name])
      );
    });

  // offerPromises - массив промисов, у которых resolve(undefined)
  await Promise.all(offerPromises); // [undefined, undefined...]
};
