const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://toplistmaker.onrender.com/api";

/**
 * Fetches all templates from the database with specified filters
 *
 * @param {string} filters - query string of the desired filters
 * @returns data containing all fetched templates
 */
export const fetchTemplates = (filters) => {
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
  return fetch(
    `${API_BASE_URL}/templates?creatorId=${userId}&sortBy=id&sortOrder=desc`
  ).then((response) => response.json());
};

/**
 * Fetches all templates from a specified user from the database
 *
 * @param {number} userId - ID of the user
 * @returns data containing all fetched templates
 */
export const fetchAllTemplateNamesFromUser = (userId) => {
  return fetch(
    `${API_BASE_URL}/templates?creatorId=${userId}&idsAndNames=true`
  ).then((response) => response.json());
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
export const addNewTemplate = (templateData) => {
  const formData = new FormData();
  formData.append("name", templateData.name);
  formData.append("items", JSON.stringify(templateData.items));
  formData.append("settings", JSON.stringify(templateData.settings));
  formData.append("creator_id", templateData.creator_id);

  if (templateData.cover_image) {
    formData.append("cover_image", templateData.cover_image);
  }

  if (templateData.description) {
    formData.append("description", templateData.description);
  }

  if (templateData.category) {
    formData.append("category", templateData.category);
  }

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return fetch(`${API_BASE_URL}/templates/`, {
    method: "POST",
    body: formData,
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
  const formData = new FormData();
  formData.append("name", templateData.name);
  formData.append("items", JSON.stringify(templateData.items));
  formData.append("settings", JSON.stringify(templateData.settings));

  if (templateData.cover_image) {
    formData.append("cover_image", templateData.cover_image);
  }

  if (templateData.description) {
    formData.append("description", templateData.description);
  }

  if (templateData.category) {
    formData.append("category", templateData.category);
  }

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return fetch(`${API_BASE_URL}/templates/${id}`, {
    method: "PATCH",
    body: formData,
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

export const deleteTemplatesFromUser = (user_id) => {
  const token = localStorage.getItem("token");
  return fetch(`${API_BASE_URL}/templates/fromuser/${user_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};

/**
 * Fetches the count of templates from the database
 *
 * @param {string} filters - optional search filters
 * @returns data containing the count of templates
 */
export const fetchTemplateCount = (filters = "") => {
  return fetch(
    `${API_BASE_URL}/templates?count=true${filters === "" ? "" : `&${filters}`}`
  ).then((response) => response.json());
};
