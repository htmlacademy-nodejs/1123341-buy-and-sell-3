'use strict';

const fs = require(`fs`).promises;
const FILENAME = `mocks.json`;
let data = null;

const getMockData = async () => {
  if (data !== null) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);

  } catch (err) {
    console.error(err);
    throw err; // аналогично return Promise.reject(err)
  }

  return data; // аналогично Promise.resolve(data)
};

module.exports = getMockData;
