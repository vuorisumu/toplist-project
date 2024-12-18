const schemas = require("../schemas/templateSchemas");

/**
 * Constructs an SQL query with filters and/or sorting for template related queries
 * @param {Object} req - object containing requested filters
 * @returns an object containing the full query and an array with all parameters
 */
function filteredTemplatesQuery(req) {
  const { error, value } = schemas.querySchema.validate(req);
  if (error) {
    throw error;
  }

  const conditions = [];
  const queryParams = {};
  let filteredQuery;

  // fetch just the count of the templates and return immediately
  /*if (value.count) {
    filteredQuery = "SELECT COUNT(id) AS count FROM templates";
    return { filteredQuery, queryParams };
  }
*/
  if (value.namesOnly) {
    filteredQuery = "SELECT DISTINCT t.name ";
  } else if (value.idsAndNames) {
    filteredQuery = "SELECT t.name, t.id ";
  } else if (value.count) {
    filteredQuery = "SELECT COUNT(t.id) AS count ";
  } else {
    filteredQuery =
      "SELECT t.id, t.name, t.description, u.user_name, t.creator_id, t.category, t.cover_image, t.settings ";
  }

  // join relevant tables
  if (value.search || value.tname || value.uname || value.sortBy) {
    filteredQuery +=
      "FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id";
  } else {
    filteredQuery += "FROM templates t";
  }

  // general search
  if (value.search) {
    conditions.push(
      "(lower(t.name) LIKE lower(:search) OR lower(u.user_name) LIKE lower(:search))"
    );
    for (let i = 0; i < 2; i++) {
      queryParams["search"] = `%${value.search}%`;
    }
  }

  // template name search
  if (value.tname) {
    conditions.push("lower(t.name) LIKE lower(:tname)");
    queryParams["tname"] = `%${value.tname}%`;
  }

  // username search
  if (value.uname) {
    conditions.push("lower(u.user_name) LIKE lower(:uname)");
    queryParams["uname"] = `%${value.uname}%`;
  }

  // get templates from a specified creator
  if (value.creatorId) {
    conditions.push("t.creator_id = :creatorId");
    queryParams["creatorId"] = value.creatorId;
  }

  // get templates from specified categories
  if (value.category) {
    const category = Array.isArray(value.category)
      ? value.category
      : [value.category];
    const categoryConditions = [];
    for (let i = 0; i < category.length; i++) {
      // 21 = Uncategorized
      if (category[i] === 21) {
        categoryConditions.push("t.category IS NULL");
      }
      categoryConditions.push(`t.category = :cat${i}`);
      queryParams[`cat${i}`] = category[i];
    }
    const categoryQuery = "(" + categoryConditions.join(" OR ") + ")";
    conditions.push(categoryQuery);
  }

  // add conditions to query string
  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

  // sorting
  if (value.sortBy && ["id", "name", "creatorname"].includes(value.sortBy)) {
    let sortBy = value.sortBy;

    // sort by template id
    if (value.sortBy === "id") {
      sortBy = "t.id";
    }

    // sort by creator name
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

  // get a specific amount of rows
  if (value.amount) {
    filteredQuery += ` OFFSET ${value.from} ROWS FETCH NEXT ${value.amount} ROWS ONLY`;
  }

  return { filteredQuery, queryParams };
}

module.exports = {
  filteredTemplatesQuery,
};
