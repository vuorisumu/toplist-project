import { useRef, useState } from "react";
import Search from "./Search";
import Dropdown from "./Dropdown";
import {
  fetchRankingNamesByInput,
  fetchTemplateNamesByInput,
  fetchUserNamesByInput,
  fetchUserNamesWithTemplatesByInput,
  fetchUserNamesWithTopListsByInput,
} from "./api";
import {
  fetchAllNamesByInput,
  fetchCombinedToplistNamesByInput,
} from "../util/dataHandler";

function AdvancedSearch({ searchLists, onSearch, onClear, templateId }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const searchInput = useRef("");
  const nameSearchInput = useRef("");
  const userSearchInput = useRef("");

  // sort by options as srings
  const sortByOptions = {
    LIST_NAME: searchLists ? "List name" : "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };
  const placeholder = sortByOptions.LIST_NAME;

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

    console.log(searchQuery);
    onSearch(searchQuery);
  };

  const selectFromDropdown = (val) => setSortBy(val);

  const handleClear = () => {
    setClearInput(true);
    setTimeout(() => setClearInput(false), 100);
    onClear();
  };

  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  const setSearch = (val) => (searchInput.current = val);
  const setNameInput = (val) => (nameSearchInput.current = val);
  const setUserInput = (val) => (userSearchInput.current = val);

  const onEnterDefault = (val) => {
    setSearch(val);
    handleSearch();
  };

  const onEnterName = (val) => {
    setNameInput(val);
    handleSearch();
  };

  const onEnterUser = (val) => {
    setUserInput(val);
    handleSearch();
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

        <button type="button" onClick={handleSearch} className="searchButton">
          Search
        </button>
      </div>

      {filtersOpen ? (
        <div className="filtersContainer">
          <div>
            <h3>Advanced search:</h3>
            {searchLists ? (
              <div className="searchInput">
                {/* Top list name search */}
                <label>Search top list by name: </label>
                <Search
                  valueUpdated={setNameInput}
                  fetchFunction={fetchRankingNamesByInput}
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
            Close filters
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
