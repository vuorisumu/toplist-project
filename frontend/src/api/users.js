const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://toplistmaker.onrender.com/api";

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
 * Fetches a user with a specified email from the database
 *
 * @param {string} email - email of the user
 * @returns data of the fetched user
 */
export const fetchUserByEmail = (email) => {
  return fetch(`${API_BASE_URL}/users?email=${email}`).then((response) =>
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
 * Updates data of an user with given ID
 *
 * @param {number} id - ID of the user to be edited
 * @param {object} userData - user data
 * @returns the ID of the edited user on successful edit
 */
export const updateuser = (id, userData) => {
  const formData = new FormData();
  if (userData.user_name) {
    formData.append("user_name", userData.user_name);
  }

  if (userData.email) {
    formData.append("email", userData.email);
  }

  if (userData.password) {
    formData.append("password", userData.password);
  }

  console.log(formData);
  return fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    body: formData,
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
  const token = localStorage.getItem("token");
  return fetch(`${API_BASE_URL}/users/auth/`, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const deleteUser = (id) => {
  const token = localStorage.getItem("token");
  return fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};
