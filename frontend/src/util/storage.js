import { fetchAllCategories } from "../components/api";
import { formatData } from "./dataHandler";

export const getCategories = async () => {
  if (sessionStorage.getItem("categories") !== null) {
    console.log("session storage found");
    return JSON.parse(sessionStorage.getItem("categories"));
  } else {
    console.log("no session storage, adding..");
    const categoryData = await fetchAllCategories()
      .then((data) => {
        return formatData(data);
      })
      .catch((err) => console.log(err));

    sessionStorage.setItem("category", JSON.stringify(categoryData));
    return categoryData;
  }
};

export const getCategoryById = async (id) => {
  if (!id || id <= 0) return "Uncategorized";
  try {
    const categories = await getCategories();
    const foundCategory = categories.filter((category) => category.id === id);
    return foundCategory[0].name;
  } catch (err) {
    console.log(err);
    return "Uncategorized";
  }
};
