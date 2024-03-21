'use strict';

const {
  Errors: { BadRequestError },
} = require('finale-rest');

const {
  API: {
    HEADERS: { X_SLUG },
    SLUGS: { MYSELF },
  },
} = require('../../config');

module.exports = (req, res, context) => {
  let slug = req.params.slug;
  if (!slug || slug === MYSELF) {
    slug = req.header(X_SLUG);
  }

  if (!slug) {
    throw new BadRequestError(MISSING_USER_SLUG_ERROR);
  }

  const decodedSlug = Buffer.from(slug, 'base64').toString();
  if (decodedSlug.length === 0) {
    throw new BadRequestError('Invalid user slug');
  }

  if (decodedSlug === MYSELF) {
    context.slug = MYSELF;
  } else {
    context.slug = null;
  }

  req.params.slug = decodedSlug;
  
  return context.continue;
};
