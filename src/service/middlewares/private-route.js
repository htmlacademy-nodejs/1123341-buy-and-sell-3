'use strict';

module.exports = (req, res, next) => {
  const {isLogged} = req.session;

  if (!isLogged) {
    // Если не выполнил вход и его следует перенаправить на страницу «Вход»
    res.redirect(`/login`);

  } else {
    next();
  }
};

