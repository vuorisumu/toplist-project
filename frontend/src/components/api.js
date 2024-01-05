const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAllTemplates = () => {
  return fetch(`${API_BASE_URL}/templates`).then((response) => response.json());
};
