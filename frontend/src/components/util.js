import {
  fetchTagByName,
  addNewTag,
  addNewUser,
  fetchUserByName,
  fetchAllTemplatesFiltered,
  fetchAllRankingsFiltered,
} from "./api";

/**
 * Gets the current local time
 * @returns the current local ISO date and time
 */
export const getLocalTime = () => {
  const timeNow = new Date();
  const offset = timeNow.getTimezoneOffset() * 60000;
  const localISOTime = new Date(timeNow - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return localISOTime;
};

/**
 * Refreshes the view, clearing all input fields
 */
export const clearAll = () => {
  window.location.reload(false);
};

/**
 * Checks if the user has logged in as admin
 * @returns true if the user has logged in as admin, false if not
 */
export const checkAdminStatus = () => {
  const storedAdmin = localStorage.getItem("admin");
  const storedLogin = localStorage.getItem("login");
  const storedRole = localStorage.getItem("role");

  return storedAdmin && storedLogin && storedRole === "admin";
};

/**
 * Checks if the user has logged in as either creator or admin
 * @returns true if the user has logged in as creator or admin, false if not
 */
export const checkCreatorStatus = () => {
  const storedLogin = localStorage.getItem("login");
  const storedRole = localStorage.getItem("role");

  return storedLogin && (storedRole === "admin" || storedRole === "creator");
};

/**
 * Transforms the tag names to their respective IDs, fetched from the database
 * @param {array} tagNames - string array containing the tag names
 * @returns number array containing the tag IDs
 */
export const getTagNumbers = async (tagNames) => {
  const tagNumbers = [];
  try {
    await Promise.all(
      tagNames.map(async (t) => {
        const fetchedTag = await fetchTagByName(t.trim());
        let newId;
        if (fetchedTag.length > 0) {
          // tag already exists in database
          newId = fetchedTag[0].id;
        } else {
          // add new tag to database
          const newTag = {
            name: t,
          };
          const newTagRes = await addNewTag(newTag);
          newId = newTagRes.id;
        }
        tagNumbers.push(newId);
      })
    );
    return tagNumbers;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Gets the ID of a user by the username, adds a new user to database if no
 * user was found with the given username
 * @param {string} username - name of the user
 * @returns the ID of the user
 */
export const getUserId = async (username) => {
  const fetchedUser = await fetchUserByName(username.trim());
  if (fetchedUser.length > 0) {
    // use the id of user that already exists
    return fetchedUser[0].user_id;
  } else {
    // add new user that's not already in database
    const newUser = {
      user_name: username,
    };

    const newUserResponse = await addNewUser(newUser);
    return newUserResponse.id;
  }
};

/**
 * Gets all template names from the database
 * @returns string array containing all template names
 */
export const getAllTemplateNames = async () => {
  try {
    const templates = await fetchAllTemplatesFiltered("distinct=true");
    return templates.map((template) => template.name);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Gets all ranking names from the database, optionally those rankings
 * using a specified template
 * @param {number} id - ID of the template used in the rankings. If 0, will
 * retrieve the names of all rankings
 * @returns string array containing all the fetched ranking names
 */
export const getAllRankingNames = async (id) => {
  try {
    let filter = `distinct=true`;
    if (id > 0) {
      filter += `&tempId=${id}`;
    }
    const lists = await fetchAllRankingsFiltered(filter);
    return lists.map((list) => list.ranking_name);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Formats a given date to a prettier format
 * @param {Date} date - date to be formatted
 * @returns a formatted date as a string
 */
export const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = new Date(date).toLocaleString(undefined, options);

  return formattedDate;
};
