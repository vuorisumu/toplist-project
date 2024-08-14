import { useEffect, useRef, useState } from "react";
import Search from "./Search";
import Dropdown from "./Dropdown";
import {
  fetchAllNamesByInput,
  fetchCombinedToplistNamesByInput,
} from "../util/dataHandler";
import { getCategories } from "../util/storage";
import { fetchTemplateNamesByInput } from "../api/templates";
import { fetchListNamesByInput } from "../api/toplists";
import {
  fetchUserNamesWithTemplatesByInput,
  fetchUserNamesWithTopListsByInput,
} from "../api/users";

/**
 * Reusable Advanced Search component that has one general search field and
 * two additional search fields for more specific searching. Also has sort by
 * options in a dropdown menu.
 *
 * @param {boolean} props.searchLists - Whether to search for top lists or templates.
 * True when searching for lists, false for templates.
 * @param {function(string)} props.onSearch - Callback function for when the search
 * button or enter key was pressed.
 * @param {function} props.onClear - Callback function for clearing the filters.
 * @param {number} props.templateId - Optional template ID to be passed on the Search
 * component.
 * @returns {JSX.Element} The Advanced Search component
 */
function AdvancedSearch({ searchLists, onSearch, onClear, templateId }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const searchInput = useRef("");
  const nameSearchInput = useRef("");
  const userSearchInput = useRef("");
  const [categories, setCategories] = useState({});

  // sort by options as srings
  const sortByOptions = {
    LIST_NAME: searchLists ? "List name" : "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };
  const placeholder = sortByOptions.LIST_NAME;

  // Setters for filters
  const selectFromDropdown = (val) => setSortBy(val);
  const setSearch = (val) => (searchInput.current = val);
  const setNameInput = (val) => (nameSearchInput.current = val);
  const setUserInput = (val) => (userSearchInput.current = val);

  useEffect(() => {
    if (!templateId) {
      getCategories()
        .then((data) => {
          data.map((c) => (c.check = false));
          setCategories(data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  /**
   * Builds the search query and passes it to callback function.
   */
  const handleSearch = () => {
    let searchQuery = "";
    let searchConditions = [];

    if (searchInput.current.trim() !== "") {
      searchConditions.push(`search=${searchInput.current.trim()}`);
    }

    if (nameSearchInput.current.trim() !== "") {
      const searching = searchLists ? "rname" : "tname";
      searchConditions.push(`${searching}=${nameSearchInput.current.trim()}`);
    }

    if (userSearchInput.current.trim() !== "") {
      searchConditions.push(`uname=${userSearchInput.current.trim()}`);
    }

    if (!templateId) {
      const checkedCategories = categories
        .filter((c) => c.check)
        .map((c) => c.id);
      if (checkedCategories.length > 0) {
        const categorySearch = checkedCategories
          .map((id) => `category=${id}`)
          .join("&");
        searchConditions.push(categorySearch);
      }
    }

    if (sortBy !== "") {
      if (sortBy === sortByOptions.LIST_NAME) {
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

    onSearch(searchQuery);
  };

  /**
   * Handles clearing the filters and calls the callback function.
   */
  const handleClear = () => {
    setClearInput(true);
    setSortBy("");
    const clearChecks = [...categories];
    clearChecks.forEach((c) => (c.check = false));
    setCategories(clearChecks);
    setTimeout(() => setClearInput(false), 100);
    onClear();
  };

  /**
   * Opens and closes the filter menu
   */
  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  /**
   * Pressing the enter key on default search field.
   *
   * @param {string} val - the current value of the input field
   */
  const onEnterDefault = (val) => {
    setSearch(val);
    handleSearch();
  };

  /**
   * Pressing the enter key on name search field.
   *
   * @param {string} val - the current value of the input field
   */
  const onEnterName = (val) => {
    setNameInput(val);
    handleSearch();
  };

  /**
   * Pressing the enter key on user search field.
   *
   * @param {string} val - the current value of the input field
   */
  const onEnterUser = (val) => {
    setUserInput(val);
    handleSearch();
  };

  /**
   * Sets a category from specified index to be selected
   * @param {number} index - index of the selected category
   */
  const categoryCheck = (index) => {
    const checkedCategory = [...categories];
    checkedCategory[index].check = !categories[index].check;
    setCategories(checkedCategory);
  };

  return (
    <div className="searchContainer">
      <div className="searchInput general">
        <Search
          valueUpdated={setSearch}
          fetchFunction={
            searchLists
              ? fetchCombinedToplistNamesByInput
              : fetchAllNamesByInput
          }
          combinedSearch={true}
          onClear={clearInput}
          templateId={templateId}
          onEnterKey={onEnterDefault}
        />
      </div>

      {filtersOpen ? (
        <div className="filtersContainer">
          <div>
            <div className="wordFilters">
              <h3>Advanced search:</h3>
              {searchLists ? (
                <div className="searchInput">
                  {/* Top list name search */}
                  <label>Search top list by name: </label>
                  <Search
                    valueUpdated={setNameInput}
                    fetchFunction={fetchListNamesByInput}
                    onClear={clearInput}
                    templateId={templateId}
                    onEnterKey={onEnterName}
                  />
                </div>
              ) : (
                <div className="searchInput">
                  {/* Template name search */}
                  <label>Search template by name: </label>
                  <Search
                    valueUpdated={setNameInput}
                    fetchFunction={fetchTemplateNamesByInput}
                    onClear={clearInput}
                    onEnterKey={onEnterName}
                  />
                </div>
              )}

              <div className="searchInput">
                {/* Username search */}
                <label>Search from creator: </label>
                <Search
                  valueUpdated={setUserInput}
                  fetchFunction={
                    searchLists
                      ? fetchUserNamesWithTopListsByInput
                      : fetchUserNamesWithTemplatesByInput
                  }
                  onClear={clearInput}
                  templateId={templateId}
                  onEnterKey={onEnterUser}
                />
              </div>
            </div>

            {!templateId && (
              <>
                <h4>Categories:</h4>
                <ul className="tagFilters">
                  {categories.map((category, index) => (
                    <li key={"category" + index}>
                      <input
                        type="checkbox"
                        checked={category.check}
                        onChange={() => categoryCheck(index)}
                      />
                      <span onClick={() => categoryCheck(index)}>
                        {category.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Sort by options */}
            <Dropdown
              label={"Sort by"}
              placeholder={placeholder}
              items={Object.values(sortByOptions)}
              onSelect={selectFromDropdown}
            />
          </div>

          <button type="button" onClick={handleClear} className="clearButton">
            Clear filters
          </button>

          <button
            type="button"
            onClick={toggleFilterMenu}
            className="closeButton"
          >
            Hide filters
          </button>

          <button type="button" onClick={handleSearch} className="searchButton">
            Search
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={toggleFilterMenu}
            className="showAdvancedButton"
          >
            Advanced search
          </button>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;
