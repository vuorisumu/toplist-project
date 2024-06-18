const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://toplistmaker.onrender.com/api";

export const testOracle = (first, second) => {
  return fetch(`${API_BASE_URL}/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first,
      second,
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

// --- TEMPLATES ---

/**
 * Fetches all templates from the database
 * @returns data containing all templates
 */
export const fetchAllTemplates = () => {
  return fetch(`${API_BASE_URL}/templates`).then((response) => response.json());
};

/**
 * Fetches all templates from the database with specified filters
 * @param {string} filters - query string of the desired filters
 * @returns data containing all fetched templates
 */
export const fetchAllTemplatesFiltered = (filters) => {
  return fetch(`${API_BASE_URL}/templates?${filters}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches a template with a specified ID
 * @param {number} id - ID of the template to be fetched
 * @returns data containing the fetched template
 */
export const fetchTemplateById = (id) => {
  return fetch(`${API_BASE_URL}/templates/${id}`).then((response) =>
    response.json()
  );
};

/**
 * Sends a request to access edit mode of a specified template
 * @param {number} id - ID of the template
 * @param {string} password - given password for the template edit mode
 * @returns data of the requested template on successful query
 */
export const enterTemplateEditMode = (id, password) => {
  return fetch(`${API_BASE_URL}/templates/${id}/edit/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      editkey: password,
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

/**
 * Adds a new template to database
 * @param {object} template - template data
 * @returns the ID of the newly added template on successful insert
 */
export const addNewTemplate = (template) => {
  return fetch(`${API_BASE_URL}/templates/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(template),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

/**
 * Updates data of a template with given ID
 * @param {number} id - ID of the template to be edited
 * @param {object} templateData - template data
 * @returns the ID of the edited template on successful edit
 */
export const updateTemplate = (id, templateData) => {
  return fetch(`${API_BASE_URL}/templates/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(templateData),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

/**
 * Deleted a template from database with given ID
 * @param {number} id - ID of the template to be deleted
 * @returns a response containing information about whether the deletion was successful
 */
export const deleteTemplate = (id) => {
  return fetch(`${API_BASE_URL}/templates/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

/**
 * Fetches the count of templates from the database
 * @returns data containing the count of templates
 */
export const fetchTemplateCount = () => {
  return fetch(`${API_BASE_URL}/templates?count=true}`).then((response) =>
    response.json()
  );
};

// --- RANKINGS ---

/**
 * Fetches all rankings from the database
 * @returns data containing all rankings
 */
export const fetchAllRankings = () => {
  return fetch(`${API_BASE_URL}/toplists`).then((response) => response.json());
};

/**
 * Fetches all rankings that match the given filters
 * @param {string} filters - query string specifying the filters
 * @returns data containing all fetched rankings
 */
export const fetchAllRankingsFiltered = (filters) => {
  return fetch(`${API_BASE_URL}/toplists?${filters}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches the count of rankings from the database
 * @param {number} id - id of the template used in the rankings
 * @returns data containing the count of ranking lists
 */
export const fetchRankingCount = (id) => {
  let searchQuery = `${API_BASE_URL}/toplists?count=true}`;
  if (id > 0) {
    searchQuery += `&tempId=${id}`;
  }
  return fetch(searchQuery).then((response) => response.json());
};

/**
 * Fetch ranking with given ID from the database
 * @param {number} id - ID of the ranking
 * @returns data of the fetched ranking
 */
export const fetchRankingById = (id) => {
  return fetch(`${API_BASE_URL}/toplists/${id}`).then((response) =>
    response.json()
  );
};

/**
 * Adds a new ranking to database
 * @param {object} ranking - ranking data to be added
 * @returns a response with newly added ranking ID on successful insert
 */
export const addNewRanking = (ranking) => {
  return fetch(`${API_BASE_URL}/toplists/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ranking),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

/**
 * Deletes a ranking with specified ID
 * @param {number} id - ID of the template to be deleted
 * @returns a response containing information about the result of deletion request
 */
export const deleteRanking = (id) => {
  return fetch(`${API_BASE_URL}/toplists/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

// --- TAGS ---

/**
 * Fetches all tags from the database
 * @returns data of all tags
 */
export const fetchAllTags = () => {
  return fetch(`${API_BASE_URL}/tags`).then((response) => response.json());
};

/**
 * Fetches all tags from the database with specified filters
 * @param {string} filters - query string specifying the filters
 * @returns data of all fetched tags
 */
export const fetchAllTagsFiltered = (filters) => {
  return fetch(`${API_BASE_URL}/tags?${filters}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches a tag with given ID from the database
 * @param {number} id - ID of the tag
 * @returns data of the fetched tag
 */
export const fetchTagById = (id) => {
  return fetch(`${API_BASE_URL}/tags/${id}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches a tag with a specified name from the database
 * @param {string} name - name of the tag
 * @returns data of the fetched tag
 */
export const fetchTagByName = (name) => {
  return fetch(`${API_BASE_URL}/tags?name=${name}`).then((response) =>
    response.json()
  );
};

/**
 * Adds a new tag to database
 * @param {object} tagData - object containing tag data
 * @returns a response containing the ID of newly added tag on successful insert
 */
export const addNewTag = (tagData) => {
  return fetch(`${API_BASE_URL}/tags/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tagData),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

// --- USERS ---

/**
 * Fetches all user data from the database
 * @returns data of all users
 */
export const fetchAllUsers = () => {
  return fetch(`${API_BASE_URL}/users`).then((response) => response.json());
};

/**
 * Fetches all users that have made templates, optionally with a specified template
 * @param {number} id - ID of a template, or 0 when fetching users with any template
 * @returns data containing all fetched users
 */
export const fetchAllUsersWithTemplates = (id) => {
  let searchQuery = `${API_BASE_URL}/users?hasTemplates=true`;
  if (id > 0) {
    searchQuery += `&tempId=${id}`;
  }
  return fetch(searchQuery).then((response) => response.json());
};

/**
 * Fetches all users that have made rankings, optionally with rankings made from a specified template
 * @param {number} id - ID of a template, or 0 when fetching users with rankings from any template
 * @returns data containing all fetched users
 */
export const fetchAllUsersWithRankings = (id) => {
  let searchQuery = `${API_BASE_URL}/users?hasRankings=true`;
  if (id > 0) {
    searchQuery += `&tempId=${id}`;
  }
  return fetch(searchQuery).then((response) => response.json());
};

/**
 * Fetches a user with given ID from the database
 * @param {number} id - ID of the user
 * @returns data of the fetched user
 */
export const fetchUserById = (id) => {
  return fetch(`${API_BASE_URL}/users/${id}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches a user with a specified name from the database
 * @param {string} name - name of the user
 * @returns data of the fetched user
 */
export const fetchUserByName = (name) => {
  return fetch(`${API_BASE_URL}/users?name=${name}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches a user with a specified name from the database
 * @param {string} name - name of the user
 * @returns data of the fetched user
 */
export const fetchUserByNameOrEmail = (name, email) => {
  return fetch(`${API_BASE_URL}/users?name=${name}&email=${email}`).then(
    (response) => response.json()
  );
};

/**
 * Adds a new user to database
 * @param {object} userData - data of the user to be added
 * @returns a response containing newly added user ID on successful insert
 */
export const addNewUser = (userData) => {
  return fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

// --- ROLES ---

/**
 * Sends a login request with specified role and password
 * @param {object} loginData - object containing the username and password
 * @returns a response with role data on successful login
 */
export const login = (loginData) => {
  return fetch(`${API_BASE_URL}/login/${loginData.role}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};
