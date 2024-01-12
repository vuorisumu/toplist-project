import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllTemplatesFiltered } from "./api";
import { checkAdminStatus } from "./util";
import FilterTemplates from "./FilterTemplates";

function Main() {
  const [templates, setTemplates] = useState([]);
  const [loadedTemplates, setLoadedTemplates] = useState(0);
  const loadSize = 5;
  const [filters, setFilters] = useState("sortBy=id&sortOrder=desc");
  const [isDefaultSearch, setIsDefaultSearch] = useState(true);

  useEffect(() => {
    fetchRecent();
  }, []);

  // fetch the newest templates
  async function fetchRecent() {
    fetchAllTemplatesFiltered(`sortBy=id&sortOrder=desc&limit=${loadSize}`)
      .then((data) => {
        setFilters("sortBy=id&sortOrder=desc");
        setIsDefaultSearch(true);
        setTemplates(data);
        setLoadedTemplates(loadSize);
      })
      .catch((err) => console.log(err));
  }

  async function newSearch(query) {
    fetchAllTemplatesFiltered(`${query}&limit=${loadSize}`)
      .then((data) => {
        setIsDefaultSearch(false);
        setTemplates(data);
        setLoadedTemplates(loadSize);
      })
      .catch((err) => console.log(err));
  }

  // load more templates with current search filters
  async function loadMore() {
    let limit = `${loadedTemplates},${loadSize}`;
    console.log(limit);
    fetchAllTemplatesFiltered(`${filters}&limit=${limit}`)
      .then((data) => {
        if (loadedTemplates === 0) {
          setTemplates(data);
        } else {
          setTemplates((prevTemplates) => [...prevTemplates, ...data]);
        }
        setLoadedTemplates(loadedTemplates + loadSize);
      })
      .catch((err) => console.log(err));
  }

  const handleFilteredSearch = (val) => {
    setFilters(val);
    newSearch(val);
  };

  return (
    <>
      <h1>Browse templates</h1>
      <FilterTemplates search={handleFilteredSearch} clear={fetchRecent} />

      <div>
        {/* Title */}
        {isDefaultSearch ? <h2>Recent templates</h2> : <h2>Search results</h2>}

        {/* Template list */}
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

        {/* Load more button */}
        <button type="button" onClick={loadMore}>
          Load more
        </button>
      </div>
    </>
  );
}

export default Main;
