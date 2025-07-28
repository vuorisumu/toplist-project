import { fetchAndFormat } from "./apiutils";

/**
 * Fetches a user with given ID from the database
 *
 * @param {number} id - ID of the user
 * @returns data of the fetched user
 */
export const fetchUserById = (id) => fetchAndFormat(`/users/${id}`);

/**
 * Fetches a user with a specified name from the database
 *
 * @param {string} name - name of the user
 * @returns data of the fetched user
 */
export const fetchUserByName = (name) => fetchAndFormat(`/users`, { name });
