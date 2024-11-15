import { useState, useEffect } from "react";
import { formatData, getCountFromData } from "../util/dataHandler";
import Template from "./Template";
import AdvancedSearch from "./AdvancedSearch";
import { fetchTemplates, fetchTemplateCount } from "../api/templates";
import UserSearch from "./UserSearch";
import Dropdown from "./Dropdown";

/**
 * Container for displaying templates and the search bar.
 * Handles the displaying and loading of the templates.
 *
 * @param {string} props.searchInput - String to be used in searching
 * @returns {JSX.Element} Template container component with a
 * search component attached
 */
function TemplateContainer({ searchInput = "" }) {
  const [templates, setTemplates] = useState([]);
  const defaultQuery = "sortBy=id&sortOrder=desc";
  const [filters, setFilters] = useState(defaultQuery);
  const [sortBy, setSortBy] = useState("id&sortOrder=desc");
  const [search, setSearch] = useState("");
  const [templateCount, setTemplateCount] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadMoreAmount = 5;
  const [loading, setLoading] = useState(true);

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
    getTemplateCount();
  }, []);

  useEffect(() => {
    let q = [];
    if (search !== "") {
      q.push(`search=${search}`);
    }
    q.push(`sortBy=${sortBy}`);

    setFilters(q.join("&"));
  }, [search, sortBy]);

  useEffect(() => {
    if (templateCount > 0) {
      console.log(filters);
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
  const getTemplateCount = async () => {
    fetchTemplateCount()
      .then((data) => {
        setTemplateCount(getCountFromData(data));
      })
      .catch((err) => console.log(err));
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
      <Dropdown
        label={"Sort by"}
        placeholder={options.LIST_NAME}
        items={Object.values(options)}
        onSelect={selectFromDropdown}
      />
      <UserSearch searchInput={search} />

      <div>
        <h2>Templates</h2>

        {!loading && templates.length < 1 && <p>No templates found</p>}

        <ul className="lists">
          {loading ? (
            <li className="template">
              <p>Loading</p>
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
