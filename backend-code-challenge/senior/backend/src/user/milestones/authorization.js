'use strict';

const {
  Errors: { ForbiddenError },
} = require('finale-rest');

const {
  API: {
    KEY,
    HEADERS: { X_API_KEY },
  },
} = require('../../config');
const WRONG_API_KEY_ERROR = 'Wrong API key';
module.exports = (req, res, context) => {
  const apiKey = req.header(X_API_KEY);

  if (apiKey !== KEY) {
    throw new ForbiddenError(WRONG_API_KEY_ERROR);
  }

  return context.continue;
};
