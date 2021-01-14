'use strict';

const chalk = require(`chalk`);
const http = require(`http`); // поможет создать http-сервер
const fs = require(`fs`).promises;
const {HttpCode} = require(`../../constants`);

// Значение может быть любым в пределах от 0 до 65535
// но лучше не использовать диапазон от 0 до 1023
// не использовать список зарегестрированных в IANA
const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

// функция-отправки ответа клиентам;
// res -- объект-ответ. Получаем во время обработки входящего подключения от пользователя;
// statusCode — код http-ответа
// message — текст ответа
const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;

  // У объекта ответа (response) метод writeHead,
  // позволяющий сформировать и отправить заголовок ответа на запрос
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  // метод end - отправляет ответ;
  res.end(template);
};

// для обработки запросов от клиентов
// все вызовы консолей внутри функции будут видны внутри консоли сервера, но не в консоли браузера
const onClientConnect = async (req, res) => {
  // в случае отсутствия файла с моками, например, когда пользователь обратился к несуществующему ресурсу
  const notFoundMessageText = `Not found`;
  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks
          .map((post) => `<li>${post.title}</li>`)
          .join(``);

        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);

      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    // метод createServer создаёт новый сервер.
    // onClientConnect - колбэк, будет вызван при получении запроса от клиента
    http.createServer(onClientConnect)
      .listen(port) // Сервер создан, но ещё не запущен. Чтобы он начал прослушивать порт и принимать соединения
      .on(`listening`, (err) => {
        // событие listening - обработать ошибки и понять, что сервер действительно запущен
        if (err) {
          return console.error(`Ошибка при создании сервера`, err);
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
  }
};
