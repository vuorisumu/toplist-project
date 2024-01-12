const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- TEMPLATES ---
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

export const addNewTemplate = (template) => {
  return fetch(`${API_BASE_URL}/templates/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(template),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => console.error("Error:", error));
};

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

// --- RANKINGS ---
export const fetchAllRankings = () => {
  return fetch(`${API_BASE_URL}/rankings`).then((response) => response.json());
};

export const fetchAllRankingsFiltered = (filters) => {
  return fetch(`${API_BASE_URL}/rankings?${filters}`).then((response) =>
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

// --- TAGS ---
export const fetchAllTags = () => {
  return fetch(`${API_BASE_URL}/tags`).then((response) => response.json());
};

export const fetchTagById = (id) => {
  return fetch(`${API_BASE_URL}/tags/${id}`).then((response) =>
    response.json()
  );
};

export const fetchTagByName = (name) => {
  return fetch(`${API_BASE_URL}/tags?name=${name}`).then((response) =>
    response.json()
  );
};

export const addNewTag = (tagData) => {
  return fetch(`${API_BASE_URL}/tags/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tagData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => console.error("Error:", error));
};

// --- USERS ---
export const fetchAllUsers = () => {
  return fetch(`${API_BASE_URL}/users`).then((response) => response.json());
};

export const fetchAllUsersWithTemplates = (id) => {
  let searchQuery = `${API_BASE_URL}/users?hasTemplates=true`;
  if (id > 0) {
    searchQuery += `&tempId=${id}`;
  }
  return fetch(searchQuery).then((response) => response.json());
};

export const fetchAllUsersWithRankings = (id) => {
  let searchQuery = `${API_BASE_URL}/users?hasRankings=true`;
  if (id > 0) {
    searchQuery += `&tempId=${id}`;
  }
  return fetch(searchQuery).then((response) => response.json());
};

export const fetchUserById = (id) => {
  return fetch(`${API_BASE_URL}/users/${id}`).then((response) =>
    response.json()
  );
};

export const fetchUserByName = (name) => {
  return fetch(`${API_BASE_URL}/users?name=${name}`).then((response) =>
    response.json()
  );
};

export const addNewUser = (userData) => {
  return fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => console.error("Error:", error));
};

// --- ROLES ---
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
