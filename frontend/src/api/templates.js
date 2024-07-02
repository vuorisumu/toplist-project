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
