const query = require("express/lib/middleware/query");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});
const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE users.email LIKE $1`, [email])
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message, NULL));
};
exports.getUserWithEmail = getUserWithEmail;

// const getUserWithEmail = function (email) {
// return pool
//   .query(`SELECT * FROM users WHERE users.email LIKE $1`, [email])
//   .then((result) => result.rows[0])
//   .catch((err) => {
//     console.log(err.message)
//   });
// };
// exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(
      `
  SELECT * 
  FROM users
  WHERE users.id=$1
  `,
      [id]
    )
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function (user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [
      user.name,
      user.email,
      user.password,
    ])
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
    });
};

exports.addUser = addUser;

/// Reservations

// const getAllReservations = function (guest_id, limit = 10) {
//   return pool
//     .query(
//       `
//   SELECT *
//   FROM reservations
//   JOIN properties ON properties.id=property_id
//   WHERE guest_id = $1
//   LIMIT = $2
//   `,
//       [guest_id, limit]
//     )
//     .then((reuslt) =);
// };
// exports.getAllReservations = getAllReservations;

const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `
    SELECT *
    FROM reservations
    JOIN properties ON properties.id = property_id
    WHERE guest_id = $1
    LIMIT $2
    `,
      [guest_id, limit]
    )
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  if (options.city && options.owner_id) {
    const owner_identifier = Number(options.owner_id);
    queryParams.push(`%${owner_identifier}%`);
    queryString += `WHERE owner_id LIKE $${queryParams.length}`;
    console.log(options);
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += ` AND city LIKE $${queryParams.length}`;
      console.log(options);
    }
    if (options.minimum_price_per_night && options.maximum_price_per_night) {
      queryParams.push(`%${options.minimum_price_per_night}%`);
      queryString += ` AND minimum_price_per_night LIKE $${queryParams.length}`;
      queryParams.push(`%${options.maximum_price_per_night}%`);
      queryString += ` AND options.maximum_price_per_night LIKE $${queryParams.length}`;
      console.log(
        options.maximum_price_per_night,
        options.minimum_price_per_night
      );
    }
    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += ` AND options.minimum_rating >= $${queryParams.length}`;
      console.log(options.minimum_rating);
    }
  }
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
// exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return pool
    .query(
      `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        property.owner_id,
        property.title,
        property.description,
        property.thumbnail_photo_url,
        property.cover_photo_url,
        property.cost_per_night,
        property.street,
        property.city,
        property.province,
        property.post_code,
        property.country,
        property.parking_spaces,
        property.number_of_bathrooms,
        property.number_of_bedrooms,
      ]
    )
    .then((result) => {
      result.rows;
      console.log(result.rows);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.addProperty = addProperty;
