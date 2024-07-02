const schemas = require("../schemas/userSchemas");

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

  // names of users with top lists
  if (value.hasRankings) {
    filteredQuery = `SELECT DISTINCT u.user_name FROM toplists top LEFT JOIN users u ON top.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;

    // specified template id
    if (value.tempId) {
      filteredQuery += ` AND top.template_id = :tempId`;
      queryParams["tempId"] = value.tempId;
    }
    return { filteredQuery, queryParams };
  }

  // names of users with templates
  if (value.hasTemplates) {
    filteredQuery = `SELECT DISTINCT u.user_name FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id WHERE u.user_name IS NOT NULL`;

    // specified template id
    if (value.tempId) {
      filteredQuery += ` AND t.id = :tempid`;
      queryParams["tempid"] = value.tempId;
    }

    return { filteredQuery, queryParams };
  }

  // whether to fetch the names only or other relevant info
  filteredQuery = value.search
    ? `SELECT user_name FROM users`
    : `SELECT user_id, user_name FROM users`;

  // username search
  if (value.search) {
    conditions.push(`lower(user_name) LIKE lower(:search)`);
    queryParams["search"] = `%${value.search}%`;
  }

  // get user by name
  if (value.name) {
    conditions.push(`user_name = :name`);
    queryParams["name"] = value.name;
  }

  // get user by email
  if (value.email) {
    conditions.push(`email = :email`);
    queryParams["email"] = value.email;
  }

  // join conditions
  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" OR ");
  }

  // fetch only specified amount of rows
  if (value.amount) {
    filteredQuery += ` OFFSET ${value.from} ROWS FETCH NEXT ${value.amount} ROWS ONLY`;
  }

  return { filteredQuery, queryParams };
}

module.exports = {
  filteredUserQuery,
};
