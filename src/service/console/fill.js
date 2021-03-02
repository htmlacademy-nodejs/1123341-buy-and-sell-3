'use strict';

const chalk = require(`chalk`);
const path = require(`path`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const {OfferType, SumRestrict, PictureRestrict, users} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = path.resolve(__dirname, `../../../data/sentences.txt`);
const FILE_TITLES_PATH = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_CATEGORIES_PATH = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS_PATH = path.resolve(__dirname, `../../../data/comments.txt`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, offerId, userCount, comments) => (
  Array(count)
    .fill({})
    .map(() => ({
      userId: getRandomInt(1, userCount),
      offerId,
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `),
    }))
);

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateOffers = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const offers = generateOffers(countOffer, titles, categories.length, users.length, sentences, commentSentences);

    // Извлекаем комментарии в отдельный массив;
    const comments = offers.flatMap((offer) => offer.comments);

    // Пример [{offerId: 1, categoryId: 3}, {offerId: 2, categoryId: 5}, ...]
    const offerCategories = offers.map((offer, index) => ({offerId: index + 1, categoryId: offer.category[0]}));

    const userValues = users
      .map(({email, passwordHash, firstName, lastName, avatar}) =>
        `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`)
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const offerValues = offers
      .map(({title, description, type, sum, picture, userId}) =>
        `('${title}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`)
      .join(`,\n`);

    const offerCategoryValues = offerCategories
      .map(({offerId, categoryId}) => `(${offerId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(({text, userId, offerId}) => `('${text}', ${userId}, ${offerId})`)
      .join(`,\n`);

    const content = `INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE offers DISABLE TRIGGER ALL;
INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
${offerValues};
ALTER TABLE offers ENABLE TRIGGER ALL;
ALTER TABLE offer_categories DISABLE TRIGGER ALL;
INSERT INTO offer_categories(offer_id, category_id) VALUES
${offerCategoryValues};
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(path.resolve(__dirname, `../../../${FILE_NAME}`), content);
      console.log(chalk.green(`Operation success. File created.`));

    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
