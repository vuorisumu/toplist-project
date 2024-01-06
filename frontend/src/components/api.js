const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAllTemplates = () => {
  return fetch(`${API_BASE_URL}/templates`).then((response) => response.json());
};

export const fetchAllTemplatesFiltered = (filters) => {
  return fetch(`${API_BASE_URL}/templates?${filters}`).then((response) =>
    response.json()
  );
};

export const fetchTemplateById = (id) => {
  return fetch(`${API_BASE_URL}/templates/${id}`).then((response) =>
    response.json()
  );
};

export const addNewRanking = (ranking) => {
  fetch(`${API_BASE_URL}/rankings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ranking),
  })
    .then((response) => response.json())
    .then((data) => console.log("Response:", data))
    .catch((error) => console.error("Error:", error));
};

export const fetchAllUsers = () => {
  return fetch(`${API_BASE_URL}/users`).then((response) => response.json());
};

export const fetchUserById = (id) => {
  return fetch(`${API_BASE_URL}/users/${id}`).then((response) =>
    response.json()
  );
};
