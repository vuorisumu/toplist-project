import { jwtDecode } from "jwt-decode";
import { getTemplateCreatorIdFromData } from "./dataHandler";
import { fetchTemplateCreatorId } from "../api/templates";

export const isAdmin = () => {
  const token = sessionStorage.getItem("token");
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
  const token = sessionStorage.getItem("token");
  if (!token) return false;
  return true;
};

export const isCreatorOfTemplate = async (id) => {
  if (isAdmin() === true) return true;

  const token = sessionStorage.getItem("token");
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
