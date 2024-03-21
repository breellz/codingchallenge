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
   // Get the slug from the request parameters or headers
  let slug = req.params.slug;
  if (!slug || slug === MYSELF) {
    slug = req.header(X_SLUG);
  }
// Throw an error if the slug is missing
  if (!slug) {
    throw new BadRequestError(MISSING_USER_SLUG_ERROR);
  }
 // Decode the slug from base64
  const decodedSlug = Buffer.from(slug, 'base64').toString();
  if (decodedSlug.length === 0) {
    throw new BadRequestError('Invalid user slug');
  }
 // Set the context slug based on the decoded slug
  if (decodedSlug === MYSELF) {
    context.slug = MYSELF;
  } else {
    context.slug = null;
  }
// Update the request parameters with the decoded slug
  req.params.slug = decodedSlug;

  return context.continue;
};
