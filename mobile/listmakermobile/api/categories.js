import { BASE_URL, formatData } from "./apiutils";

export const fetchAllCategories = () => {
    return fetch(`${BASE_URL}/categories`)
        .then((response) => response.json())
        .then((data) => formatData(data));
};
