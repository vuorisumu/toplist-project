const mysql = require("mysql");
const dotenv = require("dotenv");
const schemas = require("./schemas");

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout: 10000,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
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
  const { error, value } = schemas.querySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = `SELECT * FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id`;

  // sorting
  if (value.sortBy && ["id", "name", "creatorname"].includes(value.sortBy)) {
    let sortBy = value.sortBy;

    if (value.sortBy === "id") {
      sortBy = "t.id";
    }

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

  if (value.limit) {
    filteredQuery += ` LIMIT ${value.limit}`;
  }

  // log the query in full
  console.log("Final Query:", filteredQuery);

  return { filteredQuery };
}

// ranking query with filters
async function filteredRankingQuery(req) {
  const { error, value } = schemas.rankingQuerySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = `SELECT * FROM rankedlists r LEFT JOIN users u ON r.creator_id = u.user_id LEFT JOIN templates t ON r.template_id = t.id`;

  // sorting
  if (
    value.sortBy &&
    ["name", "creatorname", "templatename"].includes(value.sortBy)
  ) {
    let sortBy = "r.ranking_name";

    // if sorting by creator name
    if (value.sortBy === "creatorname") {
      sortBy = "u.user_name";
    }

    if (value.sortBy === "templatename") {
      sortBy = "t.name";
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

// users query with conditions
async function filteredUserQuery(req) {
  const { error, value } = schemas.userQuerySchema.validate(req);
  if (error) {
    throw error;
  }

  /*
  if (value.hasTemplates) {
    return `SELECT DISTINCT u.user_name FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;
  }*/

  let filteredQuery = `SELECT * FROM users`;
  const conditions = [];
  const queryParams = [];

  if (value.name) {
    conditions.push(`user_name = ?`);
    queryParams.push(value.name);
  }

  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

  // log the query in full
  console.log("Final user Query:", filteredQuery);

  return { filteredQuery, queryParams };
}

// tag query with conditions
async function filteredTagQuery(req) {
  const { error, value } = schemas.tagSchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = `SELECT * FROM tags`;
  const conditions = [];
  const queryParams = [];

  if (value.name) {
    conditions.push(`name = ?`);
    queryParams.push(value.name);
  }

  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

  // log the query in full
  console.log("Final Query:", filteredQuery);

  return { filteredQuery, queryParams };
}

module.exports = {
  pool,
  query,
  filteredTemplatesQuery,
  filteredRankingQuery,
  filteredUserQuery,
  filteredTagQuery,
};
