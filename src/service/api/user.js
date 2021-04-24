'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const schemeValidator = require(`../middlewares/scheme-validator`);
const alreadyRegister = require(`../middlewares/already-register`);
const newUserSchema = require(`../middlewares/schemes/user-scheme`);


module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/`, route);

  route.get(`/user`, async (req, res) => {
    const result = await userService.findAll();
    res
      .status(HttpCode.OK)
      .json(result);
  });

  route.post(`/user`,
      [
        schemeValidator(newUserSchema),
        alreadyRegister(userService)
      ],

      async (req, res) => {
        const formData = req.body;
        const newUser = await userService.add(formData);

        return res
          .status(HttpCode.CREATED)
          .json(newUser);
      }
  );
};


