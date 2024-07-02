const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://toplistmaker.onrender.com/api";

// --- TEMPLATES ---

/**
 * Fetches all templates from the database
 *
 * @returns data containing all templates
 */
export const fetchAllTemplates = () => {
  return fetch(`${API_BASE_URL}/templates`).then((response) => response.json());
};

/**
 * Fetches all templates from the database with specified filters
 *
 * @param {string} filters - query string of the desired filters
 * @returns data containing all fetched templates
 */
export const fetchAllTemplatesFiltered = (filters) => {
  return fetch(`${API_BASE_URL}/templates?${filters}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches all templates from a specified user from the database
 *
 * @param {number} userId - ID of the user
 * @returns data containing all fetched templates
 */
export const fetchAllTemplatesFromUser = (userId) => {
  return fetch(`${API_BASE_URL}/templates?creatorId=${userId}`).then(
    (response) => response.json()
  );
};

/**
 * Fetches template names by given input.
 *
 * @param {string} input - input string for searching templates by name
 * @returns data containing all fetched template names
 */
export const fetchTemplateNamesByInput = (input) => {
  return fetch(
    `${API_BASE_URL}/templates?namesOnly=true&tname=${input}&from=0&amount=10`
  ).then((response) => response.json());
};

/**
 * Fetches a template with a specified ID
 *
 * @param {number} id - ID of the template to be fetched
 * @returns data containing the fetched template
 */
export const fetchTemplateById = (id) => {
  return fetch(`${API_BASE_URL}/templates/${id}`).then((response) =>
    response.json()
  );
};

export const fetchTemplateCreatorId = (templateId) => {
  return fetch(
    `${API_BASE_URL}/templates/${templateId}?getCreatorId=true`
  ).then((response) => response.json());
};

/**
 * Adds a new template to database
 *
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
 *
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
 *
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
 *
 * @returns data containing the count of templates
 */
export const fetchTemplateCount = () => {
  return fetch(`${API_BASE_URL}/templates?count=true`).then((response) =>
    response.json()
  );
};

// --- RANKINGS ---

/**
 * Fetches all rankings from the database
 *
 * @returns data containing all rankings
 */
export const fetchAllRankings = () => {
  return fetch(`${API_BASE_URL}/toplists`).then((response) => response.json());
};

/**
 * Fetches all rankings that match the given filters
 *
 * @param {string} filters - query string specifying the filters
 * @returns data containing all fetched rankings
 */
export const fetchAllRankingsFiltered = (filters) => {
  return fetch(`${API_BASE_URL}/toplists?${filters}`).then((response) =>
    response.json()
  );
};

/**
 * Fetches all top lists from specified user
 *
 * @param {number} userId - ID of the user
 * @returns data containing all fetched lists
 */
export const fetchAllListsByUser = (userId) => {
  return fetch(`${API_BASE_URL}/toplists?creatorId=${userId}`).then(
    (response) => response.json()
  );
};

/**
 * Fetches top list names by given input.
 *
 * @param {string} input - input string for searching top lists by name
 * @returns data containing all fetched top list names
 */
export const fetchRankingNamesByInput = (input) => {
  console.log(input);
  return fetch(
    `${API_BASE_URL}/toplists?namesOnly=true&rname=${input}&from=0&amount=10`
  ).then((response) => response.json());
};

/**
 * Fetches the count of rankings from the database
 *
 * @param {number} id - id of the template used in the rankings
 * @returns data containing the count of ranking lists
 */
export const fetchRankingCount = (id) => {
  let searchQuery = `${API_BASE_URL}/toplists?count=true`;
  if (id > 0) {
    searchQuery += `&tempId=${id}`;
  }
  return fetch(searchQuery).then((response) => response.json());
};

/**
 * Fetch ranking with given ID from the database
 *
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
 *
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
 *
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

// --- USERS ---

/**
 * Fetches all user data from the database
 *
 * @returns data of all users
 */
export const fetchAllUsers = () => {
  return fetch(`${API_BASE_URL}/users`).then((response) => response.json());
};

/**
 * Fetches usernames by given input.
 *
 * @param {string} input - input string for searching users by name
 * @returns data containing all fetched usernames
 */
export const fetchUserNamesByInput = (input) => {
  return fetch(`${API_BASE_URL}/users?search=${input}&from=0&amount=10`).then(
    (response) => response.json()
  );
};

/**
 * Fetches usernames, of users that have made templates, by given input.
 *
 * @param {string} input - input string for searching users by name
 * @param {number} id - ID of a template, or 0 when wetching users with any template
 * @returns data containing all fetched usernames
 */
export const fetchUserNamesWithTemplatesByInput = (input, id) => {
  let searchQuery = `${API_BASE_URL}/users?hasTemplates=true&search=${input}&from=0&amount=10`;
  if (id > 0) searchQuery += `&tempId=${id}`;

  return fetch(searchQuery).then((response) => response.json());
};

/**
 * Fetches usernames, of users that have made top lists, by given input.
 *
 * @param {string} input - input string for searching users by name
 * @param {number} id - ID of a template, or 0 when wetching users with any template
 * @returns data containing all fetched usernames
 */
export const fetchUserNamesWithTopListsByInput = (input, id) => {
  let searchQuery = `${API_BASE_URL}/users?hasRankings=true&search=${input}&from=0&amount=10`;
  if (id > 0) searchQuery += `&tempId=${id}`;

  return fetch(searchQuery).then((response) => response.json());
};

/**
 * Fetches a user with given ID from the database
 *
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
 *
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
 *
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
 *
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

/**
 * Sends login credentials to database to check if the login information was
 * correct.
 *
 * @param {object} loginData - Data containing either username or email, and a password
 * @returns a response containing information about the login attempt
 */
export const userLogin = (loginData) => {
  return fetch(`${API_BASE_URL}/users/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

/**
 * Checks the token for authorization information.
 *
 * @returns a response containing information about authorization
 */
export const auth = () => {
  const token = sessionStorage.getItem("token");
  return fetch(`${API_BASE_URL}/users/auth/`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

// --- CATEGORIES ---

/**
 * Fetches all categories from the database
 *
 * @returns a response containing the fetched data
 */
export const fetchAllCategories = () => {
  return fetch(`${API_BASE_URL}/categories`).then((response) =>
    response.json()
  );
};

/**
 * Fetches a category from the database by the given ID
 *
 * @param {number} id - The ID of the category
 * @returns a response containing the fetched catehory
 */
export const fetchCategoryById = (id) => {
  return fetch(`${API_BASE_URL}/categories/${id}`).then((response) =>
    response.json()
  );
};
