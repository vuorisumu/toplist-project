import { fetchAndFormat } from "./apiutils";

export const fetchAllCategories = () => fetchAndFormat(`/categories`);

export const fetchCategoryById = (id) => fetchAndFormat(`/categories/${id}`);

export const fetchCategoryByLabel = (label) =>
    fetchAndFormat(`/categories?label=${encodeURIComponent(label)}`);
