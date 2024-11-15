import { useEffect, useState } from "react";
import { fetchCategoryByName } from "../api/categories";
import { formatData } from "../util/dataHandler";
import { useLocation } from "react-router-dom";

function Category() {
  const location = useLocation();
  const c = decodeURI(location.pathname.replace("/category/", ""));
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (c !== "") {
      fetchCategoryByName(c)
        .then((data) => {
          const formattedData = formatData(data);
          setCategory(formattedData[0]);
        })
        .catch((err) => console.log(err));
    }
  }, [c]);

  if (!category) {
    return (
      <div className="container">
        <h1>Category</h1>
        <p>Loading</p>
      </div>
    );
  }
  return (
    <div className="container">
      <h1>{category.name}</h1>
    </div>
  );
}

export default Category;
