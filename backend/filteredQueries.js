const schemas = require("./schemas");

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
  const queryParams = {};

  // add conditions
  if (value.search) {
    conditions.push("(t.name LIKE :search OR u.user_name LIKE :search)");
    for (let i = 0; i < 2; i++) {
      queryParams["search"] = `%${value.search}%`;
    }
  }

  if (value.tname) {
    conditions.push("t.name LIKE :tname");
    queryParams["tname"] = `${value.tname}%`;
  }

  if (value.uname) {
    conditions.push("u.user_name LIKE :uname");
    queryParams["uname"] = `${value.uname}%`;
  }

  if (value.tag) {
    const tags = Array.isArray(value.tag) ? value.tag : [value.tag];
    const tagConditions = [];
    for (let i = 0; i < tags.length; i++) {
      tagConditions.push(`JSON_EXISTS(tags, '$[*]?(@ == :tag${i})')`);
      queryParams[`tag${i}`] = tags[i];
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

  if (value.amount) {
    filteredQuery += ` OFFSET ${value.from} ROWS FETCH NEXT ${value.amount} ROWS ONLY`;
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
    filteredQuery += " DISTINCT top.toplist_name";
  } else {
    filteredQuery += " *";
  }
  filteredQuery += ` FROM toplists top LEFT JOIN users u ON top.creator_id = u.user_id LEFT JOIN templates t ON top.template_id = t.id`;
  const conditions = [];
  const queryParams = {};

  // add conditions
  if (value.search) {
    conditions.push(
      "(top.toplist_name LIKE :search OR u.user_name LIKE :search)"
    );
    queryParams["search"] = `%${value.search}%`;
  }

  if (value.tempId) {
    conditions.push("t.id = :tempid");
    queryParams["tempid"] = `${value.tempId}`;
  }

  if (value.tname) {
    conditions.push("t.name LIKE :tname");
    queryParams["tname"] = `${value.tname}%`;
  }
  if (value.rname) {
    conditions.push("top.toplist_name LIKE :rname");
    queryParams["rname"] = `${value.rname}%`;
  }

  if (value.uname) {
    conditions.push("u.user_name LIKE :uname");
    queryParams["uname"] = `${value.uname}%`;
  }

  if (value.tag) {
    const tags = Array.isArray(value.tag) ? value.tag : [value.tag];
    const tagConditions = [];
    for (let i = 0; i < tags.length; i++) {
      tagConditions.push(`JSON_EXISTS(tags, '$[*]?(@ == :tag${i})')`);
      queryParams[`tag${i}`] = tags[i];
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
    let sortBy = "top.toplist_name";

    // if sorting by id
    if (value.sortBy === "id") {
      sortBy = "top.toplist_id";
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

  if (value.amount) {
    filteredQuery += ` OFFSET ${value.from} ROWS FETCH NEXT ${value.amount} ROWS ONLY`;
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
  const queryParams = {};

  if (value.hasRankings) {
    filteredQuery = `SELECT DISTINCT u.user_name FROM toplists top LEFT JOIN users u ON top.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;
    if (value.tempId) {
      filteredQuery += ` AND top.template_id = :tempId`;
      queryParams["tempId"] = value.tempId;
    }
    return { filteredQuery, queryParams };
  }

  if (value.hasTemplates) {
    filteredQuery = `SELECT DISTINCT u.user_name FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;
    if (value.tempId) {
      filteredQuery += ` AND t.id = :tempid`;
      queryParams["tempid"] = value.tempId;
    }

    return { filteredQuery, queryParams };
  }

  filteredQuery = `SELECT user_id, user_name FROM users`;

  if (value.name) {
    conditions.push(`user_name = :name`);
    queryParams["name"] = value.name;
  }

  if (value.email) {
    conditions.push(`email = :email`);
    queryParams["email"] = value.email;
  }

  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" OR ");
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

  console.log(value);

  let filteredQuery = "";
  const conditions = [];
  const queryParams = {};

  if (value.count) {
    filteredQuery = `SELECT tags.id, tags.name, COUNT(t.id) AS count
      FROM tags
      LEFT JOIN templates t
      ON JSON_EXISTS(tags, '$[*]?(@ == "tags.id")')
      GROUP BY tags.id, tags.name
      HAVING count(t.id) > 0`;
    return { filteredQuery, queryParams };

    //JSON_EXISTS(tags, '$[*]?(@ == :tag${i})')
  }

  if (value.rcount) {
    filteredQuery = `SELECT tags.id, tags.name, COUNT(top.toplist_id) AS count
      FROM tags
      LEFT JOIN templates t ON JSON_EXISTS(tags, '$[*]?(@ == "tags.id")')
      LEFT JOIN toplists top ON t.id = top.template_id
      GROUP BY tags.id, tags.name
      HAVING count(t.id) > 0`;
    return { filteredQuery, queryParams };
  }

  filteredQuery = `SELECT * FROM tags t`;

  if (value.name) {
    conditions.push(`t.name = :name`);
    queryParams.name = value.name;
  }

  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

  return { filteredQuery, queryParams };
}

module.exports = {
  filteredTemplatesQuery,
  filteredRankingQuery,
  filteredUserQuery,
  filteredTagQuery,
};
