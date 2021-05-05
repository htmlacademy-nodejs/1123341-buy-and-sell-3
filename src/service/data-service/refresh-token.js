'use strict';

class RefreshTokenService {
  constructor(sequelize) {
    this._RefreshToken = sequelize.models.RefreshToken;
  }

  async add(token) {
    const newToken = await this._RefreshToken.create({token});
    return newToken.get();
  }
}

module.exports = RefreshTokenService;
