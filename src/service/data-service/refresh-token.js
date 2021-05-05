'use strict';

class RefreshTokenService {
  constructor(sequelize) {
    this._RefreshToken = sequelize.models.RefreshToken;
  }

  async add(userId, token) {
    const newToken = await this._RefreshToken.create({userId, token});
    return newToken.get();
  }
}

module.exports = RefreshTokenService;
