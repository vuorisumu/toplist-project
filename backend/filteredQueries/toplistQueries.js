const schemas = require("../schemas/toplistSchemas");

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

  let filteredQuery = value.distinct ? "SELECT DISTINCT" : "SELECT";
  if (value.namesOnly) {
    if (!value.distinct) {
      filteredQuery += " DISTINCT";
    }

    filteredQuery += " top.toplist_name FROM toplists top";
    if (value.tempId) {
      filteredQuery += ` LEFT JOIN templates t ON top.template_id = t.id`;
    }
  } else {
    filteredQuery +=
      " top.toplist_id, top.toplist_name, top.ranked_items, top.toplist_desc, top.creation_time, top.creator_id, u.user_name, t.name, top.template_id, t.category FROM toplists top LEFT JOIN users u ON top.creator_id = u.user_id LEFT JOIN templates t ON top.template_id = t.id";
  }

  const conditions = [];
  const queryParams = {};

  // add conditions
  if (value.search) {
    conditions.push(
      "(lower(top.toplist_name) LIKE lower(:search) OR lower(u.user_name) LIKE lower(:search))"
    );
    queryParams["search"] = `%${value.search}%`;
  }

  if (value.tempId) {
    conditions.push("t.id = :tempid");
    queryParams["tempid"] = `${value.tempId}`;
  }

  if (value.tname) {
    conditions.push("lower(t.name) LIKE lower(:tname)");
    queryParams["tname"] = `${value.tname}%`;
  }
  if (value.rname) {
    conditions.push("lower(top.toplist_name) LIKE lower(:rname)");
    queryParams["rname"] = `${value.rname}%`;
  }

  if (value.uname) {
    conditions.push("lower(u.user_name) LIKE lower(:uname)");
    queryParams["uname"] = `${value.uname}%`;
  }

  if (value.creatorId) {
    conditions.push("top.creator_id = :creatorId");
    queryParams["creatorId"] = value.creatorId;
  }

  if (value.category) {
    const category = Array.isArray(value.category)
      ? value.category
      : [value.category];
    const categoryConditions = [];
    for (let i = 0; i < category.length; i++) {
      if (category[i] === 21) {
        categoryConditions.push("t.category IS NULL");
      }
      categoryConditions.push(`t.category = :cat${i}`);
      queryParams[`cat${i}`] = category[i];
    }
    const categoryQuery = "(" + categoryConditions.join(" OR ") + ")";
    conditions.push(categoryQuery);
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

  console.log(filteredQuery);
  return { filteredQuery, queryParams };
}

module.exports = {
  filteredRankingQuery,
};
