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
   // Get the API key from the request headers

  const apiKey = req.header(X_API_KEY);

  // Throw an error if the API key is wrong

  if (apiKey !== KEY) {
    throw new ForbiddenError(WRONG_API_KEY_ERROR);
  }

  // Continue to the next middleware
  return context.continue;
};
