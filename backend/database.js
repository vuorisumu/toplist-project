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

/**
 * Makes an SQL query
 * @param {string} sql - SQL query
 * @param {Array} args - parameters for the query
 * @returns a promise containing query response
 */
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

/**
 * Constructs an SQL query with filters and/or sorting for template related queries
 * @param {Object} req - object containing requested filters
 * @returns an object containing the full query and an array with all parameters
 */
async function filteredTemplatesQuery(req) {
  const { error, value } = schemas.querySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = `SELECT * FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id`;
  const conditions = [];
  const queryParams = [];

  // add conditions
  if (value.search) {
    conditions.push("(t.name LIKE ? OR u.user_name LIKE ?)");
    for (let i = 0; i < 2; i++) {
      queryParams.push(`%${value.search}%`);
    }
  }

  if (value.tname) {
    conditions.push("t.name LIKE ?");
    queryParams.push(`${value.tname}%`);
  }

  if (value.uname) {
    conditions.push("u.user_name LIKE ?");
    queryParams.push(`${value.uname}%`);
  }

  if (value.tag) {
    const tags = Array.isArray(value.tag) ? value.tag : [value.tag];
    const tagConditions = [];
    for (let i = 0; i < tags.length; i++) {
      tagConditions.push(`JSON_CONTAINS(tags, '?', '$')`);
      queryParams.push(tags[i]);
    }
    const tagQuery = "(" + tagConditions.join(" OR ") + ")";
    conditions.push(tagQuery);
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

/**
 * Constructs an SQL query with filters and/or sorting for ranking related queries
 * @param {Object} req - object containing requested filters
 * @returns an object containing the full query and an array with all parameters
 */
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
  if (value.search) {
    conditions.push("(r.ranking_name LIKE ? OR u.user_name LIKE ?)");
    for (let i = 0; i < 2; i++) {
      queryParams.push(`%${value.search}%`);
    }
  }

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

  if (value.tag) {
    const tags = Array.isArray(value.tag) ? value.tag : [value.tag];
    const tagConditions = [];
    for (let i = 0; i < tags.length; i++) {
      tagConditions.push(`JSON_CONTAINS(tags, '?', '$')`);
      queryParams.push(tags[i]);
    }
    const tagQuery = "(" + tagConditions.join(" OR ") + ")";
    conditions.push(tagQuery);
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

/**
 * Constructs an SQL query with filters and/or sorting for user related queries
 * @param {Object} req - object containing requested filters
 * @returns an object containing the full query and an array with all parameters
 */
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
    return { filteredQuery, queryParams };
  }

  if (value.hasTemplates) {
    filteredQuery = `SELECT DISTINCT u.user_name FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;
    if (value.tempId) {
      filteredQuery += ` AND t.id = ?`;
      queryParams.push(value.tempId);
    }

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

/**
 * Constructs an SQL query with filters and/or sorting for tag related queries
 * @param {Object} req - object containing requested filters
 * @returns an object containing the full query and an array with all parameters
 */
async function filteredTagQuery(req) {
  const { error, value } = schemas.tagQuerySchema.validate(req);
  if (error) {
    throw error;
  }

  let filteredQuery = "";
  const conditions = [];
  const queryParams = [];

  if (value.count) {
    filteredQuery = `SELECT tags.id, tags.name, COUNT(t.id) AS count
    FROM tags
    LEFT JOIN templates t
    ON JSON_CONTAINS(t.tags, CAST(tags.id AS CHAR), '$')
    GROUP BY tags.id
    HAVING count > 0`;
    return { filteredQuery, queryParams };
  }

  if (value.rcount) {
    filteredQuery = `SELECT tags.id, tags.name, COUNT(r.ranking_id) AS count
    FROM tags
    LEFT JOIN templates t ON JSON_CONTAINS(t.tags, CAST(tags.id AS CHAR), '$')
    LEFT JOIN rankedlists r ON t.id = r.template_id
    GROUP BY tags.id
    HAVING count > 0`;
    return { filteredQuery, queryParams };
  }

  filteredQuery = `SELECT * FROM tags t`;

  if (value.name) {
    conditions.push(`t.name = ?`);
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
