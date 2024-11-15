import { useEffect, useState } from "react";
import { getCategories } from "../util/storage";

function Categories() {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categories) {
      getCategories()
        .then((data) => {
          setCategories(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="container">
      <h1>Categories</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        categories && (
          <ul>
            {categories.map((c) => (
              <li key={`c${c.id}`}>{c.name}</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default Categories;
