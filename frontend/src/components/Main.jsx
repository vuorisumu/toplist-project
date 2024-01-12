import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllTemplatesFiltered, fetchAllUsersWithTemplates } from "./api";
import { checkAdminStatus, getAllTemplateNames } from "./util";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

function Main() {
  const [templates, setTemplates] = useState([]);
  const [loadedTemplates, setLoadedTemplates] = useState(0);
  const loadSize = 5;
  const [filters, setFilters] = useState("sortBy=id&sortOrder=desc");
  const [isDefaultSearch, setIsDefaultSearch] = useState(true);
  const [searchTemplate, setSearchTemplate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [userNames, setUserNames] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);

  // sort by options as srings
  const sortByOptions = {
    TEMPLATE_NAME: "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };

  useEffect(() => {
    fetchRecent();
    fetchTemplateNames();
    handleFetchUserNames();
  }, []);

  // fetch the newest templates
  async function fetchRecent() {
    fetchAllTemplatesFiltered(`sortBy=id&sortOrder=desc&limit=${loadSize}`)
      .then((data) => {
        setFilters("sortBy=id&sortOrder=desc");
        setIsDefaultSearch(true);
        setTemplates(data);
        setLoadedTemplates(loadedTemplates + loadSize);
      })
      .catch((err) => console.log(err));
  }

  async function newSearch(query) {
    fetchAllTemplatesFiltered(`${query}&limit=${loadSize}`)
      .then((data) => {
        setIsDefaultSearch(false);
        setTemplates(data);
        setLoadedTemplates(loadedTemplates + loadSize);
      })
      .catch((err) => console.log(err));
  }

  // load more templates with current search filters
  async function loadMore() {
    console.log(filters);
    let limit = `${loadedTemplates},${loadSize}`;
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

  async function fetchTemplateNames() {
    const tempNames = await getAllTemplateNames();
    if (tempNames.length > 0) {
      setTemplateNames(tempNames);
    }
  }

  const handleFetchUserNames = async () => {
    fetchAllUsersWithTemplates()
      .then((data) => setUserNames(data.map((u) => u.user_name)))
      .catch((err) => console.log(err));
  };

  const handleTemplateName = (val) => {
    setSearchTemplate(val);
  };

  const handleCreatorName = (val) => {
    setSearchUser(val);
  };

  const selectFromDropdown = (val) => {
    setSortBy(val);
  };

  // filtered template search
  const filteredSearch = () => {
    let searchQuery = "";
    let searchConditions = [];
    if (searchTemplate.trim() !== "") {
      searchConditions.push(`tname=${searchTemplate.trim()}`);
    }
    if (searchUser.trim() !== "") {
      searchConditions.push(`uname=${searchUser.trim()}`);
    }
    if (sortBy !== "") {
      if (sortBy === sortByOptions.TEMPLATE_NAME) {
        searchConditions.push(`sortBy=name`);
      } else if (sortBy === sortByOptions.CREATOR_NAME) {
        searchConditions.push(`sortBy=creatorname`);
      } else if (sortBy === sortByOptions.NEWEST_FIRST) {
        searchConditions.push(`sortBy=id&sortOrder=desc`);
      } else {
        searchConditions.push(`sortBy=id&sortOrder=asc`);
      }
    }
    if (searchConditions.length > 0) {
      searchQuery = searchConditions.join("&");
    }

    if (searchQuery !== "") {
      setFilters(searchQuery);
      newSearch(searchQuery);
    }
  };

  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <>
      <h1>Browse templates</h1>
      {/* Filter box */}
      {filtersOpen ? (
        <div>
          <div>
            <h2>Filter templates</h2>

            {/* Template name search */}
            <label>Search template by name: </label>
            <SearchInput
              suggestionData={templateNames}
              onChange={handleTemplateName}
              onSelected={handleTemplateName}
            />

            {/* Username search */}
            <label>Search from creator: </label>
            <SearchInput
              suggestionData={userNames}
              onChange={handleCreatorName}
              onSelected={handleCreatorName}
            />

            {/* Sort by options */}
            <Dropdown
              label={"Sort by"}
              placeholder={"Template name"}
              items={Object.values(sortByOptions)}
              onSelect={selectFromDropdown}
            />
          </div>

          <button type="button" onClick={filteredSearch}>
            Search
          </button>
          <button type="button" onClick={fetchRecent}>
            Clear filters
          </button>

          <button type="button" onClick={toggleFilterMenu}>
            Close filters
          </button>
        </div>
      ) : (
        <button type="button" onClick={toggleFilterMenu}>
          Open filters
        </button>
      )}

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
