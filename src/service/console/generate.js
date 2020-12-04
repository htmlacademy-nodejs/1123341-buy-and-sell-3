'use strict';

const {getRandomInt, shuffle} = require(`../../utils`);
const fs = require(`fs`);

const {CATEGORIES, SENTENCES, TITLES, SumRestrict, OfferType, PictureRestrict} = require(`../../constants`);
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

// padstart: слово из 2-х букв, первый символ слева "number.toString()", оставшееся пространство заполняем нулями.
const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args; // получение первого элемента массива
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer)); // преобразуем в строку JSON

    // FILE_NAME - имя файла
    // content - данные, которые требуется записать в файл
    // колбэк-функция
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  }
};
