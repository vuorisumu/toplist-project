const schemas = require("../schemas/toplistSchemas");

/**
 * Constructs an SQL query with filters and/or sorting for ranking related queries
 * @param {Object} req - object containing requested filters
 * @returns an object containing the full query and an array with all parameters
 */
function filteredRankingQuery(req) {
  const { error, value } = schemas.rankingQuerySchema.validate(req);
  if (error) {
    throw error;
  }

  const conditions = [];
  const queryParams = {};
  let filteredQuery = "SELECT ";

  // select count of lists only and return immediately
  if (value.count) {
    filteredQuery += `COUNT(toplist_id) AS count FROM toplists`;

    // select count of lists using specified template
    if (value.tempId) {
      filteredQuery += ` WHERE template_id = :tempId`;
      queryParams["tempId"] = value.tempId;
    }

    console.log(filteredQuery);
    return { filteredQuery, queryParams };
  }

  // fetch the top list names only
  if (value.namesOnly) {
    filteredQuery += "DISTINCT top.toplist_name FROM toplists top";

    // names of top lists from specified template
    if (value.tempId) {
      filteredQuery += ` LEFT JOIN templates t ON top.template_id = t.id`;
    }
  } else {
    // fetch all relevant information
    filteredQuery += ` top.toplist_id, top.toplist_name, top.ranked_items, top.toplist_desc, 
    top.creation_time, top.creator_id, u.user_name, t.name, top.template_id, t.category 
    FROM toplists top 
    LEFT JOIN users u ON top.creator_id = u.user_id 
    LEFT JOIN templates t ON top.template_id = t.id`;
  }

  // general search
  if (value.search) {
    conditions.push(
      "(lower(top.toplist_name) LIKE lower(:search) OR lower(u.user_name) LIKE lower(:search))"
    );
    queryParams["search"] = `%${value.search}%`;
  }

  // specify template id
  if (value.tempId) {
    conditions.push("t.id = :tempid");
    queryParams["tempid"] = `${value.tempId}`;
  }

  // template name search
  if (value.tname) {
    conditions.push("lower(t.name) LIKE lower(:tname)");
    queryParams["tname"] = `%${value.tname}%`;
  }

  // top list name search
  if (value.rname) {
    conditions.push("lower(top.toplist_name) LIKE lower(:rname)");
    queryParams["rname"] = `%${value.rname}%`;
  }

  // username search
  if (value.uname) {
    conditions.push("lower(u.user_name) LIKE lower(:uname)");
    queryParams["uname"] = `%${value.uname}%`;
  }

  // specify top list creator
  if (value.creatorId) {
    conditions.push("top.creator_id = :creatorId");
    queryParams["creatorId"] = value.creatorId;
  }

  // filter by specified categories
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

  // join query conditions
  if (conditions.length > 0) {
    filteredQuery += " WHERE " + conditions.join(" AND ");
  }

  // sorting
  if (
    value.sortBy &&
    ["id", "name", "creatorname", "templatename"].includes(value.sortBy)
  ) {
    // sort by toplist name by default
    let sortBy = "top.toplist_name";

    // sort by toplist id
    if (value.sortBy === "id") {
      sortBy = "top.toplist_id";
    }

    // sort by toplist creator name
    if (value.sortBy === "creatorname") {
      sortBy = "u.user_name";
    }

    // sort by template name
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

  // fetch only a specified amount of rows
  if (value.amount) {
    filteredQuery += ` OFFSET ${value.from} ROWS FETCH NEXT ${value.amount} ROWS ONLY`;
  }

  return { filteredQuery, queryParams };
}

module.exports = {
  filteredRankingQuery,
};
