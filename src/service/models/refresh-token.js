"use strict";

const {DataTypes, Model} = require(`sequelize`);
class RefreshToken extends Model {}

module.exports = (sequelize) => {
  RefreshToken.init({
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: `RefreshToken`,
    tableName: `refreshTokens`
  });

  (async () => {
    await sequelize.sync({force: true});
  })();
};
