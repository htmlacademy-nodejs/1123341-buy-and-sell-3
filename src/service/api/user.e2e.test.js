"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);

const {HttpCode, RegisterMessage, LoginMessage} = require(`../../constants`);

const mockUsers = [
  {
    userName: `Tyort`,
    userAvatar: `dvsdv.jpg`,
    email: `dlfwe@gmail.com`,
    password: `dibby1234!`,
    repeat: `dibby1234!`
  },
  {
    userName: `Kokni`,
    userAvatar: `martov.jpg`,
    email: `dolche@gmail.com`,
    password: `mamamama*`,
    repeat: `mamamama*`
  },
  {
    userName: `Karl`,
    userAvatar: `mav.jpg`,
    email: `sadekf@mail.ru`,
    password: `sdweygf267`,
    repeat: `sdweygf267`
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: [], offers: [], users: mockUsers});
  user(app, new DataService(mockDB)); // запускаем маршутизацию
});

describe(`API creates a user if form's data is valid. Emails original`, () => {
  const newUser = {
    userName: `Jiji`,
    userAvatar: `maqweqv.jpg`,
    email: `sadrvkekf@mail.ru`,
    password: `f267cew*`,
    repeat: `f267cew*`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/user`)
      .send(newUser);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Users count is changed`, () => request(app)
    .get(`/user`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});


describe(`API refuses to create a user if form's data is invalid`, () => {
  const newUser = {
    userName: 123324,
    userAvatar: 22344354,
    email: `sadrvkekf@mail`,
    password: `f2sr`,
    repeat: `f2ewewf`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/user`)
      .send(newUser);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`There are all filling mistakes from form's data`, () => {
    const allMistakes = [
      `"userName" must be a string`,
      `"userAvatar" must be a string`,
      `Неправильный email`,
      `Пароль должен быть не меньше 6 символов`,
      `Пароли не совпадают`
    ];

    expect(response.body.message).toEqual(expect.arrayContaining(allMistakes));
  });
});

describe(`API refuses to create a user if form's data is valid, but email occupied`, () => {
  const newUser = {
    userName: `Jiji`,
    userAvatar: `maqweqv.jpg`,
    email: `dolche@gmail.com`,
    password: `f267cew*`,
    repeat: `f267cew*`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/user`)
      .send(newUser);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Error message: Пользователь с таким email уже зарегистрирован`,
      () => expect(response.body.message[0]).toBe(RegisterMessage.USER_ALREADY_REGISTER));
});

// ----------------------------------------------------------------------------------------------------------//

describe(`The client is authenticated successfully`, () => {
  const existingUser = {
    email: `dlfwe@gmail.com`,
    password: `dibby1234!`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/login`)
      .send(existingUser);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});

describe(`The client isn't authenticated. The formData is invalid`, () => {
  const wrongData = {
    email: `dlfwegmail.com`,
    password: 123123
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/login`)
      .send(wrongData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`There are all filling mistakes from form's data`, () => {
    const allMistakes = [
      `Неправильный email`,
      `"password" must be a string`,
    ];

    expect(response.body.message).toEqual(expect.arrayContaining(allMistakes));
  });

});

describe(`The client isn't authenticated. The user doesn't exist`, () => {
  const wrongData = {
    email: `notUser@gmail.com`,
    password: `noMatter`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/login`)
      .send(wrongData);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Error message: Пользователь с таким email не зарегистрирован`,
      () => expect(response.body.message[0]).toBe(LoginMessage.USER_NOT_EXISTS));
});

describe(`The client isn't authenticated. The user's password is invalid`, () => {
  const wrongData = {
    email: `dlfwe@gmail.com`,
    password: `dibby12345!`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/login`)
      .send(wrongData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Error message: Неправильно введён пароль`,
      () => expect(response.body.message[0]).toBe(LoginMessage.WRONG_PASSWORD));
});
