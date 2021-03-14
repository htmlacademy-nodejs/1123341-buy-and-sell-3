'use strict';

const {Router} = require(`express`);
const multer = require(`multer`); // для обработки загружаемых файлов
const {nanoid} = require(`nanoid`);
const path = require(`path`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const offersRouter = new Router();
const api = require(`../api`).getAPI();

// Сконфигурируем multer: куда и под какими именами ему сохранять файлы.
// Создадим хранилище методом multer.diskStorage.
// destination - куда сохранять файлы, filename - присваиваем имена
const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

// Теперь сконфигурируем multer, передав ему созданное хранилище.
const upload = multer({storage});

// Затем подключим middleware для обработки прикреплённого изображения.
// В атрибуте action: обработчик приёма данных из form(new-ticket.pug)
offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  // в file попадут данные о загруженном фото. У input должны быть type="file" name="avatar"
  // name="" в input становятся свойствами body
  const {body, file} = req;
  const offerData = {
    picture: file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: Array.isArray(body.category) ? body.category : [body.category]
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);

  } catch (error) {
    res.redirect(`back`);
  }
});

// путь в res.render(``) прописываем так, как будто мы находимся в файле index.js
offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories});
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;
