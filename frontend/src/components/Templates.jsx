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

/**
 * View where the user can browse through templates. By default, renders the most recent templates
 * but allows the user to search for a specific template as well.
 */
function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const loadSize = 5;
  const defaultQuery = "sortBy=id&sortOrder=desc";
  const [filters, setFilters] = useState(defaultQuery);
  const [isDefaultSearch, setIsDefaultSearch] = useState(true);
  const [fullCount, setFullCount] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getTemplateCount();
    fetchRecent();
  }, []);

  /**
   * Fetches the count of all templates stores in the database
   */
  const getTemplateCount = async () => {
    fetchTemplateCount()
      .then((data) => setFullCount(data[0].count))
      .catch((err) => console.log(err));
  };

  /**
   * Fetches the most recent templates from the database and stores the
   * amount of loaded templates
   */
  async function fetchRecent() {
    fetchAllTemplatesFiltered(`${defaultQuery}&limit=${loadSize}`)
      .then((data) => {
        if (data.length > 0) {
          setNotFound(false);
          setTemplates(data);
          setLoadCount(loadSize);
        } else {
          setNotFound(true);
          setLoadCount(0);
        }
        setFilters(defaultQuery);
        setIsDefaultSearch(true);
      })
      .catch((err) => console.log(err));
  }

  /**
   * Makes a fresh fetch from the database, overwrites the previously fetched
   * templates with the new data and stores the amount of loaded templates.
   * @param {string} query
   */
  async function newSearch(query) {
    fetchAllTemplatesFiltered(`${query}&limit=${loadSize}`)
      .then((data) => {
        if (data.length > 0) {
          setNotFound(false);
          setTemplates(data);
          setLoadCount(loadSize);
        } else {
          setNotFound(true);
          setLoadCount(0);
        }
        setIsDefaultSearch(false);
        setFilters(query);
      })
      .catch((err) => console.log(err));
  }

  /**
   * Fetches more templates from the database with the previously used search query
   * and adds the amount of newly loaded templates to the count keeping track of
   * loaded templates.
   */
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

  /**
   * Sets the specified filters and calls for a new search
   * @param {string} val - filtered query text
   */
  const handleFilteredSearch = (val) => {
    setFilters(val === "" ? defaultQuery : val);
    newSearch(val === "" ? defaultQuery : val);
  };

  /**
   * Deletes a template with a specified ID from the database
   * @param {number} id - ID of the template to be deleted
   */
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
      <FilteredSearch
        search={handleFilteredSearch}
        clear={fetchRecent}
        searchRankings={false}
      />

      <div>
        {/* Title */}
        {isDefaultSearch ? <h2>Recent templates</h2> : <h2>Search results</h2>}

        {notFound && <p>No templates found</p>}
        {/* Template list */}
        <ul className="lists">
          {!notFound &&
            templates.map((t) => (
              <li key={t.id} className="template">
                {(t.editkey || checkAdminStatus()) && (
                  <Link to={`/edit-template/${t.id}`} className="editButton">
                    <span
                      className="material-symbols-outlined"
                      aria-label="edit template"
                    >
                      edit_square
                    </span>
                  </Link>
                )}
                <Link to={`/createranking/${t.id}`}>
                  <h2>{t.name}</h2>
                </Link>
                <p className="creator">
                  Creator: {t.user_name ? t.user_name : "Anonymous"}
                </p>
                {t.description && (
                  <p className="description">{t.description}</p>
                )}
                <div>
                  <h4>Items in the template:</h4>
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
                </div>
              </li>
            ))}
        </ul>

        {/* Load more button */}
        {!notFound && loadCount < fullCount && (
          <button type="button" onClick={loadMore} className="loadMoreButton">
            Load more
          </button>
        )}
      </div>
    </>
  );
}

export default Templates;
