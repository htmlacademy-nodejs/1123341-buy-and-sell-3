'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

// маршрут оборачиваем в функцию
module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    // Запрос http://localhost:3001/api/categories?count=true
    const {count} = req.query;

    // categories - это массив объектов.
    // Сколько уникальных категорий во всех предложениях, столько и объектов.
    // В каждом объекте:
    //   1) Созданному свойству name присваивается имя категории,
    //   2) Созданному свойству id автоматически присваивается значение,
    //   3) Если !!count === true, то формируются свойства createdAt, updatedAt.
    //      Иначе формируется ключ count (количество упоминаний категории в офферах)
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
