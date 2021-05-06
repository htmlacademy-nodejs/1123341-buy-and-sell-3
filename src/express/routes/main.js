'use strict';

const jwt = require(`jsonwebtoken`);
const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const privateRoute = require(`../../service/middlewares/private-route`);

const OFFERS_PER_PAGE = 8;
const {JWT_ACCESS_SECRET} = process.env;

// Это маршрут должен быть доступен только аутентифицированным пользователям
mainRouter.get(`/`, privateRoute, async (req, res) => {
  const token = req.cookies[`authorization`];
  const userData = jwt.verify(token, JWT_ACCESS_SECRET);

  let {page = 1} = req.query;
  page = parseInt(page, 10);

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, offers}, categories] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {
    isLogged: userData.isLogged,
    userAvatar: userData.userAvatar,
    proposals: offers,
    page,
    totalPages,
    categories
  });
});

mainRouter.get(`/search`, async (req, res) => {
  try {
    // в search попадает то, что вбито в поисковик
    // search - это значение атрибута name
    const {search} = req.query;
    // в results попадают офферы, удовлетворяющие поисковому запросу
    const results = await api.search(search);

    res.render(`search-result`, {
      results
    });

  } catch (error) {
    res.render(`search-result`, {
      results: []
    });
  }
});

module.exports = mainRouter;
