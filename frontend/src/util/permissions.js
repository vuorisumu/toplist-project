import { jwtDecode } from "jwt-decode";
import { getTemplateCreatorIdFromData } from "./dataHandler";
import { fetchTemplateCreatorId } from "../api/templates";

export const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.isAdmin === true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return !isNaN(decodedToken.id);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const loginInfo = () => {
  const token = localStorage.getItem("token");
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (err) {
    return err;
  }
};

export const isCreatorOfTemplate = async (id) => {
  if (isAdmin() === true) return true;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const tempCreator = await fetchTemplateCreatorId(id)
      .then((data) => {
        return getTemplateCreatorIdFromData(data);
      })
      .catch((err) => console.log(err));

    const decodedToken = jwtDecode(token);
    return decodedToken.id === tempCreator;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Logs in to a specific account and sets the login information to localStorage.
 * @param {JSON} credentials - Authorization credentials
 * @param {string} username - Username of the account
 * @param {string} email - Email of the account
 */
export const onLogin = async (credentials, username, email) => {
  console.log(credentials);
  localStorage.setItem("admin", credentials.admin);
  localStorage.setItem("userId", credentials.id);
  localStorage.setItem("login", "true");
  localStorage.setItem("user", username);
  localStorage.setItem("email", email);
  // window.location.reload(false);
};
