'use strict';

const axios = require('axios');

const {
  STAR_WARS_API: {
    BASE_URL,
    ENDPOINTS: { PEOPLE },
  },
} = require('../../config');

const INVALID_FAVOURITES_ERROR = 'Invalid favourites';

module.exports = async (req, res, context) => {
  // Get the instance and favourites from the context

  const { instance } = context;
  const { favourites } = instance.dataValues;
  // Throw an error if the favourites are invalid

  if (!favourites || !Array.isArray(favourites)) {
    throw new Error(INVALID_FAVOURITES_ERROR);
  }
  // Fetch the details of the favourite characters

  const favouritesDetails = await Promise.all(
    favourites.map((id) =>
      axios
        .get(`${BASE_URL}/${PEOPLE}/${id}`)
        .then((response) => response.data)
        .catch((error) => {
          console.error(`Failed to fetch character with ID ${id}: ${error.message}`);
          return null;
        }),
    ),
  );

  // Update the instance with the fetched details

  context.instance.dataValues.favouritesDetails = favouritesDetails;

  // Continue to the next middleware

  return context.continue;
};
