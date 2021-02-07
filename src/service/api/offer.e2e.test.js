'use strict';
// Создавать API для каждого теста, если тесты используют один источник данных.
// Чтобы мутации в одном тесте, не смогли повлиять на другой тест.

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `pkptwo`,
    "category": [`Игры`],
    "description": `Продаю с болью в сердце... Таких предложений больше нет! Забирай бесплатно! Такой только у меня и у Майкла Джексона.`,
    "picture": `item16.jpg`,
    "title": `Продам журналы`,
    "type": `SALE`,
    "sum": 15830,
    "comments": [
      {"id": `o-jh-X`, "text": `А где блок питания?`},
      {
        "id": `D--sw5`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {"id": `vGXyQt`, "text": `Совсем немного... А где блок питания?`},
      {
        "id": `IvjsiB`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `9KV6dw`,
        "text": `Почему в таком ужасном состоянии? А сколько игр в комплекте? Оплата наличными или перевод на карту?`
      },
      {
        "id": `knJyi7`,
        "text": `А где блок питания? Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `LWw1EH`,
    "category": [`Оружие`],
    "description": `Даю недельную гарантию. Если найдёте дешевле — сброшу цену. Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам.`,
    "picture": `item06.jpg`,
    "title": `Продам новую приставку Sony Playstation 5`,
    "type": `OFFER`,
    "sum": 1319,
    "comments": [
      {"id": `XcLu2f`, "text": `Оплата наличными или перевод на карту?`}
    ]
  },
  {
    "id": `Dru6O9`,
    "category": [`Журналы`],
    "description": `Не хочется продавать, но придется... Забирай бесплатно! Продаю с болью в сердце... Такой только у меня и у Майкла Джексона.`,
    "picture": `item12.jpg`,
    "title": `Куплю породистого кота`,
    "type": `OFFER`,
    "sum": 63447,
    "comments": [
      {
        "id": `BEtjnJ`,
        "text": `Вы что?! В магазине дешевле. Совсем немного...`
      },
      {"id": `cLmcgR`, "text": `Совсем немного... Неплохо, но дорого.`},
      {"id": `WctnHe`, "text": `Неплохо, но дорого.`}
    ]
  },
  {
    "id": `WxbLaj`,
    "category": [`Игры`],
    "description": `Пользовались бережно и только по большим праздникам. Не хочется продавать, но придется... Даю недельную гарантию. Это настоящая находка для коллекционера!`,
    "picture": `item03.jpg`,
    "title": `Продам строительный мусор`,
    "type": `SALE`,
    "sum": 56370,
    "comments": [{"id": `fAujmz`, "text": `Вы что?! В магазине дешевле.`}]
  },
  {
    "id": `xz9vz8`,
    "category": [`Журналы`],
    "description": `Если товар не понравится — верну всё до последней копейки. Если найдёте дешевле — сброшу цену. Пользовались бережно и только по большим праздникам. Такой только у меня и у Майкла Джексона.`,
    "picture": `item05.jpg`,
    "title": `Куплю породистого кота`,
    "type": `SALE`,
    "sum": 85141,
    "comments": [
      {"id": `BVNib5`, "text": `Оплата наличными или перевод на карту?`},
      {
        "id": `1zhP5G`,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Совсем немного...`
      },
      {
        "id": `MhthsY`,
        "text": `Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?`
      },
      {"id": `C4t1_Q`, "text": `Совсем немного...`},
      {
        "id": `B0vLZC`,
        "text": `Неплохо, но дорого. Совсем немного... Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    "id": `eQfiJR`,
    "category": [`Посуда`],
    "description": `Бонусом отдам все аксессуары. Не хочется продавать, но придется... Получишь коньки в подарок. Пользовались бережно и только по большим праздникам.`,
    "picture": `item16.jpg`,
    "title": `Куплю породистого кота`,
    "type": `OFFER`,
    "sum": 43914,
    "comments": [
      {
        "id": `oaDZCM`,
        "text": `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии?`
      },
      {
        "id": `_VOmFw`,
        "text": `Совсем немного... Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`
      },
      {"id": `K3bXtz`, "text": `Почему в таком ужасном состоянии?`}
    ]
  },
  {
    "id": `8IuFiT`,
    "category": [`Антиквариат`],
    "description": `Таких предложений больше нет! Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Такой только у меня и у Майкла Джексона.`,
    "picture": `item01.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 28943,
    "comments": [{"id": `wCTi8p`, "text": `Неплохо, но дорого.`}]
  },
  {
    "id": `4aDNej`,
    "category": [`Животные`],
    "description": `Хочешь изменить жизнь? Тогда бери - не думай! Продаю с болью в сердце... Даю недельную гарантию. Таких предложений больше нет!`,
    "picture": `item15.jpg`,
    "title": `Куплю что-нибудь съедобное`,
    "type": `SALE`,
    "sum": 93968,
    "comments": [
      {
        "id": `bwrv0r`,
        "text": `А где блок питания? Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `XFXQM4`,
        "text": `Совсем немного... Оплата наличными или перевод на карту? Неплохо, но дорого.`
      },
      {
        "id": `4ThG6u`,
        "text": `Неплохо, но дорого. А сколько игр в комплекте? Почему в таком ужасном состоянии?`
      },
      {
        "id": `yuudU0`,
        "text": `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`
      },
      {"id": `snrgyA`, "text": `Неплохо, но дорого. А где блок питания?`}
    ]
  },
  {
    "id": `WH4JDn`,
    "category": [`Лекарства`],
    "description": `Забирай бесплатно! Такой только у меня и у Майкла Джексона. Пользовались бережно и только по большим праздникам. Хочешь изменить жизнь? Тогда бери - не думай!`,
    "picture": `item04.jpg`,
    "title": `Продам журналы`,
    "type": `OFFER`,
    "sum": 39315,
    "comments": [
      {
        "id": `EjCTVT`,
        "text": `Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого.`
      },
      {
        "id": `wGsg5n`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {"id": `SQ9Lzc`, "text": `Вы что?! В магазине дешевле.`},
      {"id": `BFFmr2`, "text": `Неплохо, но дорого.`},
      {
        "id": `3A835H`,
        "text": `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `9u8EQY`,
        "text": `Неплохо, но дорого. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `5xd3ZQ`,
    "category": [`Лекарства`],
    "description": `Это настоящая находка для коллекционера! Хочешь изменить жизнь? Тогда бери - не думай! Продаю с болью в сердце... Даю недельную гарантию.`,
    "picture": `item11.jpg`,
    "title": `Продам плиту`,
    "type": `OFFER`,
    "sum": 28693,
    "comments": [
      {
        "id": `Vh6SB0`,
        "text": `Совсем немного... Вы что?! В магазине дешевле.`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData)); // создаем копии моков
  app.use(express.json());
  offer(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 10 offers`, () => expect(response.body.length).toBe(10));
  test(`First offer's id equals "pkptwo"`, () => expect(response.body[0].id).toBe(`pkptwo`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/pkptwo`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам журналы"`, () => expect(response.body.title).toBe(`Продам журналы`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(11))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer}; // копируем объект
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/WH4JDn`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, () => request(app)
    .get(`/offers/WH4JDn`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();
  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

// передаем на замену некорректный offer вместо несуществующего offer
test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();
  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/5xd3ZQ`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`5xd3ZQ`));
  test(`Offer count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(9))
  );
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/WH4JDn/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 6 comments`, () => expect(response.body.length).toBe(6));
  test(`First comment's id is "EjCTVT"`, () => expect(response.body[0].id).toBe(`EjCTVT`));
});


describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers/WH4JDn/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/offers/WH4JDn/comments`)
    .expect((res) => expect(res.body.length).toBe(7))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/offers/WH4JDn/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/WH4JDn/comments/wGsg5n`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`wGsg5n`));
  test(`Comments count is 5 now`, () => request(app)
    .get(`/offers/WH4JDn/comments`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/WH4JDn/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
