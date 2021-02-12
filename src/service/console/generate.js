'use strict';

// пакет fs экспортирует объект promises который содержит все те же функции (за исключением синхронных),
// которые возвращают промисы, не принимающие колбэки
const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {SumRestrict, OfferType, PictureRestrict, MAX_ID_LENGTH} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const FILE_SENTENCES_PATH = path.resolve(__dirname, `../../../data/sentences.txt`);
const FILE_TITLES_PATH = path.resolve(__dirname, `../../../data/titles.txt`);
const FILE_CATEGORIES_PATH = path.resolve(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS_PATH = path.resolve(__dirname, `../../../data/comments.txt`);
const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 6;
const FILE_NAME = `mocks.json`; // создается файл, а также его путь от коренной папки

// number.toString().padStart(2, 0) - слово состоит из 2-х символов
// номер + оставшееся место заполняем нулями
const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

// возвращает либо массив элементов, либо пустой массив в случае ошибки
const readContent = async (filePath) => {
  try {
    console.log(filePath);
    const content = await fs.readFile(filePath, `utf8`);

    // создаем массив из эелементов, разделенных переносом на новую строку (\n)
    return content.trim().split(`\n`);

  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments) => (
  Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments)
        .slice(0, getRandomInt(1, 3))
        .join(` `),
    }))
);

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args; // получение первого элемента массива с помощью деструктуризации
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));

    try {
      // FILE_NAME - имя файла
      // content - данные, которые требуется записать в файл
      // убрали третий параметр(колбэк), в котором возвращали консоль в двух случаях ошибка/без ошибки
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));

    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

