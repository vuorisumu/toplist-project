import { useState } from "react";
import Search from "./Search";
import Dropdown from "./Dropdown";
import { fetchTemplateNamesByInput } from "./api";

function AdvancedSearch({ searchLists }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [generalSuggestions, setGeneralSuggestions] = useState([]);

  // sort by options as srings
  const sortByOptions = {
    LIST_NAME: searchLists ? "List name" : "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };
  const placeholder = sortByOptions.LIST_NAME;

  const defaultSearchUpdated = async (value) => {
    console.log(value);
    fetchTemplateNamesByInput(value)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  const handleSearch = () => {
    console.log("Searching");
  };

  const selectFromDropdown = (val) => setSortBy(val);

  const handleClear = () => {
    console.log("Clear");
  };

  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <div className="searchContainer">
      <div className="searchInput general">
        <Search valueUpdated={defaultSearchUpdated} />

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
                <Search valueUpdated={defaultSearchUpdated} />
              </div>
            ) : (
              <div className="searchInput">
                {/* Template name search */}
                <label>Search template by name: </label>
                <Search valueUpdated={defaultSearchUpdated} />
              </div>
            )}

            <div className="searchInput">
              {/* Username search */}
              <label>Search from creator: </label>
              <Search valueUpdated={defaultSearchUpdated} />
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
