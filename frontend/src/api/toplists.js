const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://toplistmaker.onrender.com/api";

/**
 * Fetches all top lists that match the given filters
 *
 * @param {string} filters - query string specifying the filters
 * @returns data containing all fetched top lists
 */
export const fetchToplists = (filters) => {
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
  return fetch(
    `${API_BASE_URL}/toplists?creatorId=${userId}&sortBy=id&sortOrder=desc`
  ).then((response) => response.json());
};

/**
 * Fetches top list names by given input.
 *
 * @param {string} input - input string for searching top lists by name
 * @returns data containing all fetched top list names
 */
export const fetchListNamesByInput = (input) => {
  console.log(input);
  return fetch(
    `${API_BASE_URL}/toplists?namesOnly=true&rname=${input}&from=0&amount=10`
  ).then((response) => response.json());
};

/**
 * Fetches the count of top lists from the database
 *
 * @param {number} id - id of the template used in the top lists
 * @returns data containing the count of top lists
 */
export const fetchToplistCount = (id) => {
  let searchQuery = `${API_BASE_URL}/toplists?count=true`;
  if (id > 0) {
    searchQuery += `&tempId=${id}`;
  }
  return fetch(searchQuery).then((response) => response.json());
};

/**
 * Fetch top list with given ID from the database
 *
 * @param {number} id - ID of the top list
 * @returns data of the fetched top list
 */
export const fetchToplistById = (id) => {
  return fetch(`${API_BASE_URL}/toplists/${id}`).then((response) =>
    response.json()
  );
};

export const fetchListCreatorId = (id) => {
  return fetch(`${API_BASE_URL}/toplists/${id}?getCreatorId=true`).then((res) =>
    res.json()
  );
};

/**
 * Adds a new top list to database
 *
 * @param {object} toplist - top list data to be added
 * @returns a response with newly added top list ID on successful insert
 */
export const addNewToplist = (toplist) => {
  return fetch(`${API_BASE_URL}/toplists/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toplist),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

/**
 * Deletes a top list with specified ID
 *
 * @param {number} id - ID of the top list to be deleted
 * @returns a response containing information about the result of deletion request
 */
export const deleteToplist = (id) => {
  return fetch(`${API_BASE_URL}/toplists/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

export const deleteToplistFromUser = (user_id) => {
  const token = localStorage.getItem("token");
  return fetch(`${API_BASE_URL}/toplists/fromuser/${user_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};
