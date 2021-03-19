'use strict';

// пакет fs экспортирует объект promises который содержит все те же функции (за исключением синхронных),
// которые возвращают промисы, не принимающие колбэки
const fs = require(`fs`).promises;
const {SumRestrict, OfferType, PictureRestrict} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const path = require(`path`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const DEFAULT_COUNT = 10;
const MAX_COMMENTS = 6;

const FILE_SENTENCES_PATH = path.resolve(__dirname, `../../../data/sentences.txt`);
const FILE_TITLES_PATH = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_CATEGORIES_PATH = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS_PATH = path.resolve(__dirname, `../../../data/comments.txt`);

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    logger.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const getRandomSubarray = (items) => {
  // получим копию строки или массива

  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    // Массив items превращается просто в набор элементов
    // Из массива удаляется один элемент и пушится в result
    // Сам массив мутирует
    result.push(...items.splice(getRandomInt(0, items.length - 1), 1));
  }
  return result;
};

// number.toString().padStart(2, 0) - слово состоит из 2-х символов
// номер + оставшееся место заполняем нулями
const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();

    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = generateOffers(countOffer, titles, categories, sentences, comments);

    return initDatabase(sequelize, {offers, categories});
  }
};

