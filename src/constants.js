'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MAX_ID_LENGTH = 6;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};


const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const API_PREFIX = `/api`;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const ResultingPage = {
  LOGIN_PAGE: `login`,
  REGISTER_PAGE: `sign-up`,
};

const RegisterMessage = {
  USER_ALREADY_REGISTER: `Пользователь с таким email уже зарегистрирован`,
  WRONG_EMAIL: `Неправильный email`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  MAX_PASSWORD_LENGTH: `Пароль должен быть не больше 12 символов`,
  PASSWORDS_NOT_EQUALS: `Пароли не совпадают`,
  EMPTY_VALUE: `Не указано значение`,
};

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 12;

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  FILE_NAME,
  OfferType,
  SumRestrict,
  PictureRestrict,
  USER_ARGV_INDEX,
  ExitCode,
  HttpCode,
  MAX_ID_LENGTH,
  API_PREFIX,
  Env,
  users,
  ResultingPage,
  RegisterMessage,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
};

