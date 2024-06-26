import { jwtDecode } from "jwt-decode";

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
