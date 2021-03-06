'use strict';

const bcrypt = require(`bcrypt`);
const {DB_FORM_RELIABILITY} = process.env;

module.exports = async (req, res, next) => {
  const match = await bcrypt.compare(DB_FORM_RELIABILITY, req.body[`user-csrf`]);

  if (!match) {
    res.redirect(`/login`);

  } else {
    next();
  }
};
