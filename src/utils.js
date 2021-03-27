'use strict';

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};


// когда массив объектов типа [{name: `tyo`, id: 1}, {name: `tyo2`, id: 2}]
// нужно превратить в объект с ключами {'tyo': 1, 'tyo2': 2}
module.exports.arrToObj = (someArray) => {
  return someArray.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});
};

module.exports.fullUrl = (req) => {
  return `${req.protocol}://${req.get(`host`)}${req.originalUrl}`;
};


