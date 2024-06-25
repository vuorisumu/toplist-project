import { useState } from "react";
import Search from "./Search";
import Dropdown from "./Dropdown";
import {
  fetchRankingNamesByInput,
  fetchTemplateNamesByInput,
  fetchUserNamesByInput,
} from "./api";
import { fetchAllNamesByInput } from "../util/dataHandler";

function AdvancedSearch({ searchLists, onSearch, onClear }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [defaultSearch, setDefaultSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [clearInput, setClearInput] = useState(false);

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

    if (defaultSearch.trim() !== "") {
      searchConditions.push(`search=${defaultSearch.trim()}`);
    }

    if (nameSearch.trim() !== "") {
      const searching = searchLists ? "rname" : "tname";
      searchConditions.push(`${searching}=${nameSearch.trim()}`);
    }

    if (userSearch.trim() !== "") {
      searchConditions.push(`uname=${userSearch.trim()}`);
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

  const selectFromDropdown = (val) => setSortBy(val);

  const handleClear = () => {
    setClearInput(true);
    setTimeout(() => setClearInput(false), 100);
    onClear();
  };

  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <div className="searchContainer">
      <div className="searchInput general">
        <Search
          valueUpdated={setDefaultSearch}
          fetchFunction={fetchAllNamesByInput}
          combinedSearch={true}
          onClear={clearInput}
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
                  valueUpdated={setNameSearch}
                  fetchFunction={fetchRankingNamesByInput}
                  onClear={clearInput}
                />
              </div>
            ) : (
              <div className="searchInput">
                {/* Template name search */}
                <label>Search template by name: </label>
                <Search
                  valueUpdated={setNameSearch}
                  fetchFunction={fetchTemplateNamesByInput}
                  onClear={clearInput}
                />
              </div>
            )}

            <div className="searchInput">
              {/* Username search */}
              <label>Search from creator: </label>
              <Search
                valueUpdated={setUserSearch}
                fetchFunction={fetchUserNamesByInput}
                onClear={clearInput}
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
