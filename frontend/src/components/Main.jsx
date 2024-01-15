import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllTemplatesFiltered,
  deleteTemplate,
  fetchTemplateCount,
} from "./api";
import { checkAdminStatus } from "./util";
import FilteredSearch from "./FilteredSearch";
import ButtonPrompt from "./ButtonPrompt";

function Main() {
  const [templates, setTemplates] = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const loadSize = 5;
  const [filters, setFilters] = useState("sortBy=id&sortOrder=desc");
  const [isDefaultSearch, setIsDefaultSearch] = useState(true);
  const [fullCount, setFullCount] = useState(0);

  useEffect(() => {
    getTemplateCount();
    fetchRecent();
  }, []);

  const getTemplateCount = async () => {
    fetchTemplateCount()
      .then((data) => setFullCount(data[0].count))
      .catch((err) => console.log(err));
  };

  // fetch the newest templates
  async function fetchRecent() {
    fetchAllTemplatesFiltered(`sortBy=id&sortOrder=desc&limit=${loadSize}`)
      .then((data) => {
        setFilters("sortBy=id&sortOrder=desc");
        setIsDefaultSearch(true);
        setTemplates(data);
        setLoadCount(loadSize);
      })
      .catch((err) => console.log(err));
  }

  async function newSearch(query) {
    fetchAllTemplatesFiltered(`${query}&limit=${loadSize}`)
      .then((data) => {
        setIsDefaultSearch(false);
        setTemplates(data);
        setLoadCount(loadSize);
      })
      .catch((err) => console.log(err));
  }

  // load more templates with current search filters
  async function loadMore() {
    let newLoadSize = loadSize;
    if (loadCount + loadSize > fullCount) {
      const overFlow = loadCount + loadSize - fullCount;
      newLoadSize -= overFlow;
    }

    let limit = `${loadCount},${newLoadSize}`;
    console.log(limit);
    fetchAllTemplatesFiltered(`${filters}&limit=${limit}`)
      .then((data) => {
        if (loadCount === 0) {
          setTemplates(data);
        } else {
          setTemplates((prevTemplates) => [...prevTemplates, ...data]);
        }
        setLoadCount(loadCount + newLoadSize);
      })
      .catch((err) => console.log(err));
  }

  const handleFilteredSearch = (val) => {
    setFilters(val);
    newSearch(val);
  };

  // delete template
  const handleDelete = (id) => {
    deleteTemplate(id)
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h1>Browse templates</h1>
      <FilteredSearch
        search={handleFilteredSearch}
        clear={fetchRecent}
        searchRankings={false}
      />

      <div>
        {/* Title */}
        {isDefaultSearch ? <h2>Recent templates</h2> : <h2>Search results</h2>}

        {/* Template list */}
        <ul>
          {templates.map((t) => (
            <li key={t.id}>
              <Link to={`/createranking/${t.id}`}>
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
              {checkAdminStatus() && (
                <ButtonPrompt
                  buttonName="Delete template"
                  confirm={() => handleDelete(t.id)}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Load more button */}
        {loadCount < fullCount && (
          <button type="button" onClick={loadMore}>
            Load more
          </button>
        )}
      </div>
    </>
  );
}

export default Main;
