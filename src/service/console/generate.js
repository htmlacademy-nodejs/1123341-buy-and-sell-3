'use strict';

// ????????????????
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {SumRestrict, OfferType, PictureRestrict} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const FILE_SENTENCES_PATH = `../../data/sentences.txt`;
const FILE_TITLES_PATH = `../../data/titles.txt`;
const FILE_CATEGORIES_PATH = `../../data/categories.txt`;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

// number.toString().padStart(2, 0) - слово состоит из 2-х символов
// номер + оставшееся место заполняем нулями
const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

// возвращает либо массив элементов, либо пустой массив в случае ошибки
const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    // создаем массив из эелементов, разделенных переносом на новую строку (\n)
    return content.trim().split(`\n`);

  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);


    const [count] = args; // получение первого элемента массива с помощью деструктуризации
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      // FILE_NAME - имя файла
      // content - данные, которые требуется записать в файл
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));

    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

