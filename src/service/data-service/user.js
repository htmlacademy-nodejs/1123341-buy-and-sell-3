'use strict';

const bcrypt = require(`bcrypt`);
const saltRounds = 10;

class userService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async add(formData) {
    const {password} = formData;
    const hash = await bcrypt.hash(password, saltRounds);

    const updatedFormData = {
      ...formData,
      password: hash
    };

    delete updatedFormData.repeat;

    const newUser = await this._User.create(updatedFormData);
    return newUser.get();
  }

  async findByEmail(email) {
    const foundUser = await this._User.findOne({where: {email}});
    return foundUser;
  }

  async checkUser(user, password) {
    const match = await bcrypt.compare(password, user.password);
    return match;
  }
}

module.exports = userService;
