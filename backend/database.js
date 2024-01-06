/* eslint-disable camelcase */
const Joi = require("joi");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout: 10000,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const querySchema = Joi.object({
  sortBy: Joi.string().valid("name", "creatorname").optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("asc").optional(),
});

const rankingSchema = Joi.object({
  ranking_name: Joi.string().required(),
  template_id: Joi.number().required(),
  creator_id: Joi.number().optional(),
  description: Joi.string().optional(),
  items: Joi.object().keys({
    item_name: Joi.string().required(),
    item_note: Joi.string().optional(),
    deletable: Joi.boolean().optional(),
    rank_number: Joi.number().required(),
  }),
});

// general query function
async function query(sql, args) {
  return new Promise((resolve, reject) => {
    pool.query(sql, args, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// template query with filters
async function filteredTemplatesQuery(req) {
  const { error, value } = querySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = `SELECT * FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id`;

  // sorting
  if (value.sortBy && ["name", "creatorname"].includes(value.sortBy)) {
    let sortBy = value.sortBy;

    // if sorting by creator name
    if (value.sortBy === "creatorname") {
      sortBy = "u.user_name";
    }

    // default to asc if desc has not been specified
    const sortOrder =
      value.sortOrder && value.sortOrder.toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    if (value.sortBy === "creatorname") {
      // shows templates by anonymous creators last
      filteredQuery += ` ORDER BY ${sortBy} IS NULL ASC, ${sortBy} ${sortOrder}`;
    } else {
      filteredQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
    }
  }

  // log the query in full
  console.log("Final Query:", filteredQuery);

  return { filteredQuery };
}

// ranking query with filters
async function filteredRankingQuery(req) {
  const { error, value } = querySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = `SELECT * FROM rankedlists r LEFT JOIN users u ON r.creator_id = u.user_id LEFT JOIN templates t ON r.template_id = t.id`;

  // sorting
  if (value.sortBy && ["name", "creatorname"].includes(value.sortBy)) {
    let sortBy = value.sortBy;

    // if sorting by creator name
    if (value.sortBy === "creatorname") {
      sortBy = "u.user_name";
    }

    // default to asc if desc has not been specified
    const sortOrder =
      value.sortOrder && value.sortOrder.toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    if (value.sortBy === "creatorname") {
      // shows templates by anonymous creators last
      filteredQuery += ` ORDER BY ${sortBy} IS NULL ASC, ${sortBy} ${sortOrder}`;
    } else {
      filteredQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
    }
  }

  // log the query in full
  console.log("Final Query:", filteredQuery);

  return { filteredQuery };
}

module.exports = {
  pool,
  query,
  filteredTemplatesQuery,
  rankingSchema,
};
