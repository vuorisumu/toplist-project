import {
  fetchTagByName,
  addNewTag,
  addNewUser,
  fetchUserByName,
  fetchAllTemplatesFiltered,
  fetchAllRankingsFiltered,
} from "./api";

// get current time
export const getLocalTime = () => {
  const timeNow = new Date();
  const offset = timeNow.getTimezoneOffset() * 60000;
  const localISOTime = new Date(timeNow - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return localISOTime;
};

// clear all fields
export const clearAll = () => {
  window.location.reload(false);
};

export const checkAdminStatus = () => {
  const storedAdmin = localStorage.getItem("admin");
  const storedLogin = localStorage.getItem("login");
  const storedRole = localStorage.getItem("role");

  return storedAdmin && storedLogin && storedRole === "admin";
};

export const checkCreatorStatus = () => {
  const storedLogin = localStorage.getItem("login");
  const storedRole = localStorage.getItem("role");

  return storedLogin && (storedRole === "admin" || storedRole === "creator");
};

// convert tag names to tag ids
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

export const getAllTemplateNames = async () => {
  try {
    const templates = await fetchAllTemplatesFiltered("distinct=true");
    return templates.map((template) => template.name);
  } catch (err) {
    console.error(err);
  }
};

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
