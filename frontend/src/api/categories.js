const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://toplistmaker.onrender.com/api";

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

/**
 * Fetches a category from the database by the given label
 *
 * @param {string} label - The label of the category
 * @returns a response containing the fetched catehory
 */
export const fetchCategoryByLabel = (label) => {
  return fetch(`${API_BASE_URL}/categories?label=${label}`).then((response) =>
    response.json()
  );
};
