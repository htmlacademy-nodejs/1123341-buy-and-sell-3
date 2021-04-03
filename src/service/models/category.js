"use strict";

const {DataTypes, Model} = require(`sequelize`);

// пустой, потому что не переопределяем конструктор или добавдяем новые методы
class Category extends Model {}

// init - принимает описание модели,
// поле id определяется автоматически
const define = (sequelize) => Category.init(
    // На основании объекта, Sequelize подготовит схему базы данных
    {
      // поле
      name: {
        // Sequelize определит id самостоятельно
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: `Category`,
      tableName: `categories` // не обязательный параметр
    }
);

module.exports = define;
