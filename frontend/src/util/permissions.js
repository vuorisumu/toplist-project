import { jwtDecode } from "jwt-decode";
import { getTemplateCreatorIdFromData } from "./dataHandler";
import { fetchTemplateCreatorId } from "../api/templates";
import { fetchListCreatorId } from "../api/toplists";

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
    console.log(decodedToken.exp);
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

export const isCreatorOfList = async (id) => {
  if (isAdmin() === true) return true;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const tempCreator = await fetchListCreatorId(id)
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
