import { BASE_URL, fetchAndFormat } from "./apiutils";
const endpoint = "/templates";

export const fetchTemplates = (filters) => fetchAndFormat(endpoint, filters);

export const fetchAllTemplatesFromUser = (userID) => {
    return fetchAndFormat(endpoint, {
        creatorId: userID,
        sortBy: "id",
        sortOrder: "desc",
    });
};

export const fetchAllTemplateNamesFromUser = (userID) => {
    return fetchAndFormat(endpoint, {
        creatorId: userID,
        idsAndNames: true,
    });
};

export const fetchTemplateNamesByInput = (input) => {
    return fetchAndFormat(endpoint, {
        namesOnly: true,
        tname: input,
        from: 0,
        amount: 10,
    });
};

export const fetchTemplateById = (id) => fetchAndFormat(`${endpoint}/${id}`);

export const fetchTemplateCreatorId = (templateID) => {
    return fetchAndFormat(`${endpoint}/${templateID}`, { getCreatorId: true });
};

export const fetchTemplateCount = (filters = {}) => {
    return fetchAndFormat(endpoint, { ...filters, count: true });
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

    return fetch(`${BASE_URL}/templates/`, {
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

    return fetch(`${BASE_URL}/templates/${id}`, {
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
    return fetch(`${BASE_URL}/templates/${id}`, {
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
    return fetch(`${BASE_URL}/templates/fromuser/${user_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
};
