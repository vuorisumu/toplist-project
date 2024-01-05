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

async function filteredQuery(req) {
  const { error, value } = querySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = "SELECT * FROM templates";

  // sorting
  if (value.sortBy && ["name", "creatorname"].includes(value.sortBy)) {
    let sortBy = value.sortBy;

    // if sorting by creator name
    if (value.sortBy === "creatorname") {
      sortBy = "u.user_name";
      filteredQuery += ` t LEFT JOIN users u ON t.creator_id = u.user_id`;
    }

    // default to asc if desc has not been specified
    const sortOrder =
      value.sortOrder && value.sortOrder.toLowerCase() === "desc"
        ? "DESC"
        : "ASC";
    filteredQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
  }

  // log the query in full
  console.log("Final Query:", filteredQuery);

  return { filteredQuery };
}

module.exports = {
  pool,
  query,
  filteredQuery,
};
