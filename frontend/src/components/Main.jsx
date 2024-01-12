import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllTemplates, fetchAllTemplatesFiltered } from "./api";
import { checkAdminStatus } from "./util";

function Main() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchRecent();
  }, []);

  // fetch the newest templates
  async function fetchRecent() {
    fetchAllTemplatesFiltered("sortBy=id&sortOrder=desc&limit=5")
      .then((data) => setTemplates(data))
      .catch((err) => console.log(err));
  }

  async function fetchAll() {
    fetchAllTemplates()
      .then((data) => setTemplates(data))
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchAllFiltered(filters) {
    fetchAllTemplatesFiltered(filters)
      .then((data) => setTemplates(data))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <h1>Main</h1>
      <button onClick={fetchAll}>Fetch all</button>
      <button onClick={() => fetchAllFiltered("sortBy=creatorname")}>
        Sort by creator name
      </button>
      <ul>
        {templates.map((t) => (
          <li key={t.id}>
            <Link to={`/createlisting/${t.id}`}>
              <h2>{t.name}</h2>
            </Link>
            <p>Creator: {t.user_name ? t.user_name : "Anonymous"}</p>
            {(t.editkey || checkAdminStatus()) && (
              <Link to={`/edit-template/${t.id}`}>Edit template</Link>
            )}
            <ul>
              {JSON.parse(t.items).map((item, index) => (
                <li key={index}>{item.item_name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Main;
