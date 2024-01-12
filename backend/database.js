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
  const conditions = [];
  const queryParams = [];

  // add conditions
  if (value.tname) {
    conditions.push("t.name LIKE ?");
    queryParams.push(`${value.tname}%`);
  }

  if (value.uname) {
    conditions.push("u.user_name LIKE ?");
    queryParams.push(`${value.uname}%`);
  }

  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

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

  return { filteredQuery, queryParams };
}

// ranking query with filters
async function filteredRankingQuery(req) {
  const { error, value } = schemas.rankingQuerySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = "SELECT";
  if (value.distinct) {
    filteredQuery += " DISTINCT r.ranking_name";
  } else {
    filteredQuery += " *";
  }
  filteredQuery += ` FROM rankedlists r LEFT JOIN users u ON r.creator_id = u.user_id LEFT JOIN templates t ON r.template_id = t.id`;
  const conditions = [];
  const queryParams = [];

  // add conditions
  if (value.tempId) {
    conditions.push("t.id = ?");
    queryParams.push(value.tempId);
  }

  if (value.tname) {
    conditions.push("t.name LIKE ?");
    queryParams.push(`${value.tname}%`);
  }
  if (value.rname) {
    conditions.push("r.ranking_name LIKE ?");
    queryParams.push(`${value.rname}%`);
  }

  if (value.uname) {
    conditions.push("u.user_name LIKE ?");
    queryParams.push(`${value.uname}%`);
  }

  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

  // sorting
  if (
    value.sortBy &&
    ["id", "name", "creatorname", "templatename"].includes(value.sortBy)
  ) {
    let sortBy = "r.ranking_name";

    // if sorting by id
    if (value.sortBy === "id") {
      sortBy = "r.ranking_id";
    }

    // if sorting by creator name
    if (value.sortBy === "creatorname") {
      sortBy = "u.user_name";
    }

    // if sorting by template name
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

  if (value.limit) {
    filteredQuery += ` LIMIT ${value.limit}`;
  }

  return { filteredQuery, queryParams };
}

// users query with conditions
async function filteredUserQuery(req) {
  const { error, value } = schemas.userQuerySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = "";
  const conditions = [];
  const queryParams = [];

  if (value.hasRankings) {
    filteredQuery = `SELECT DISTINCT u.user_name FROM rankedlists r LEFT JOIN users u ON r.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;
    if (value.tempId) {
      filteredQuery += ` AND r.template_id = ?`;
      queryParams.push(value.tempId);
    }

    console.log(filteredQuery);
    return { filteredQuery, queryParams };
  }

  if (value.hasTemplates) {
    filteredQuery = `SELECT DISTINCT u.user_name FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;
    if (value.tempId) {
      filteredQuery += ` AND t.id = ?`;
      queryParams.push(value.tempId);
    }

    console.log(filteredQuery);
    return { filteredQuery, queryParams };
  }

  filteredQuery = `SELECT * FROM users`;

  if (value.name) {
    conditions.push(`user_name = ?`);
    queryParams.push(value.name);
  }

  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

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
