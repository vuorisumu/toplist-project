import { useState, useEffect } from "react";
import { formatData, getCountFromData } from "../util/dataHandler";
import Template from "./Template";
import { fetchTemplates, fetchTemplateCount } from "../api/templates";
import UserSearch from "./UserSearch";
import Dropdown from "./Dropdown";

/**
 * Container for displaying templates and the search bar.
 * Handles the displaying and loading of the templates.
 *
 * @param {string} props.searchInput - String to be used in searching
 * @param {number} props.categoryId - Category ID for filtering, default 0 fetches all categories
 * @returns {JSX.Element} Template container component with a
 * search component attached
 */
function TemplateContainer({ searchInput = "", categoryId = 0 }) {
  const [templates, setTemplates] = useState([]);
  const [filters, setFilters] = useState("");
  const [sortBy, setSortBy] = useState("id&sortOrder=desc");
  const [search, setSearch] = useState("");
  const [templateCount, setTemplateCount] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadMoreAmount = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const options = {
    LIST_NAME: "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };

  useEffect(() => {
    if (searchInput !== "") {
      handleSearch(searchInput);
    }
  }, [searchInput]);

  useEffect(() => {
    let q = [];
    if (search !== "") {
      q.push(`search=${search}`);
    }
    if (categoryId > 0) {
      q.push(`category=${categoryId}`);
    }
    q.push(`sortBy=${sortBy}`);

    setFilters(q.join("&"));
  }, [search, sortBy]);

  useEffect(() => {
    if (filters !== "") {
      let q = [];
      if (search !== "") {
        q.push(`search=${search}`);
      }
      if (categoryId > 0) {
        q.push(`category=${categoryId}`);
      }
      getTemplateCount(q.join("&"));
    }
  }, [filters]);

  useEffect(() => {
    if (templateCount > 0) {
      loadTemplates();
    }
  }, [templateCount, filters]);

  /**
   * Sets the sort by value to state
   *
   * @param {string} val - Value selected from dropdown
   */
  const selectFromDropdown = (val) => {
    if (val !== "") {
      if (val === options.LIST_NAME) {
        setSortBy(`name`);
      } else if (val === options.CREATOR_NAME) {
        setSortBy(`creatorname`);
      } else if (val === options.NEWEST_FIRST) {
        setSortBy(`id&sortOrder=desc`);
      } else {
        setSortBy(`id&sortOrder=asc`);
      }
    }
  };

  /**
   * Fetches the full count of templates in the database and sets it to state.
   */
  const getTemplateCount = async (f = "") => {
    fetchTemplateCount(f)
      .then((data) => {
        setTemplateCount(getCountFromData(data));
        if (getCountFromData(data) < 1) {
          setLoading(false);
        }
      })
      .catch((err) => setError(true));
  };

  /**
   * Loads a set amount of templates from the database. By default this function
   * makes a new fetch that overwrites the previously fetched templates, but can
   * also be used to load more with the same given filters.
   *
   * @param {boolean} loadMore False by default, meaning the function will overwrite
   * previously fetched templates. When set to true, loads more templates with the
   * same filters.
   */
  const loadTemplates = async (loadMore = false) => {
    const loaded = loadMore ? loadedCount : 0;

    fetchTemplates(`${filters}&from=${loaded}&amount=${loadMoreAmount}`)
      .then((data) => {
        const formattedData = formatData(data);
        if (!loadMore) {
          setTemplates(formattedData);
          setLoading(false);
        } else {
          setTemplates((prevTemplates) => [...prevTemplates, ...formattedData]);
        }
        setLoadedCount(loaded + loadMoreAmount);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Handles the search functionality
   * @param {string} val - search input
   */
  const handleSearch = (val) => {
    setSearch(val);
    setFilters(
      val === "" ? defaultQuery : `search=${val}&sortBy=id&sortOrder=desc`
    );
  };

  return (
    <>
      {categoryId === 0 && <UserSearch searchInput={search} />}

      <Dropdown
        label={"Sort by"}
        placeholder={options.LIST_NAME}
        items={Object.values(options)}
        onSelect={selectFromDropdown}
      />

      <div>
        <h2>Templates</h2>

        {!loading && templates.length < 1 && <p>No templates found</p>}

        <ul className="lists">
          {loading || error ? (
            <li className="template">
              <p>{error ? "Database error" : "Loading"}</p>
            </li>
          ) : (
            templates.map((template) => (
              <li key={template.id} className="template">
                <Template data={template} />
              </li>
            ))
          )}
        </ul>

        {/* Load more button */}
        {templates.length > 0 && loadedCount < templateCount && (
          <button
            type="button"
            onClick={() => loadTemplates(true)}
            className="loadMoreButton"
          >
            Load more
          </button>
        )}
      </div>
    </>
  );
}

export default TemplateContainer;
