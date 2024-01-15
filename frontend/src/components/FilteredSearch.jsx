import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";
import PropTypes from "prop-types";
import { getAllTemplateNames, getAllRankingNames } from "./util";
import {
  fetchAllUsersWithTemplates,
  fetchAllUsersWithRankings,
  fetchAllTagsFiltered,
} from "./api";

/**
 * Reusable filtered search component that renders a general search input field, and an option
 * to open advanced search options. Advanced search options show two  search input fields, first
 * searching for the name of a template or a ranking, and the second searching for a user. Optionally
 * also shows checkboxes for tags.
 * @param {function} props.search - callback function for confirming the search, contains
 * the full search query depending on the chosen filters
 * @param {function} props.clear -  callback function for clearing the filters
 * @param {boolean} props.searchRankings - boolean to determine if the filters should be
 * specific to rankings or templates. True if rankings, false if templates
 * @param {number} props.id - ID of the template if search filters are to be used with template
 * specific rankings.
 * @returns
 */
function FilteredSearch({ search, clear, searchRankings, id }) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // search suggestions
  const [allNames, setAllNames] = useState([]);
  const [rankingNames, setRankingNames] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);
  const [userNames, setUserNames] = useState([]);

  // search inputs
  const [searchInput, setSearchInput] = useState("");
  const [searchRanking, setSearchRanking] = useState("");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const [tags, setTags] = useState({});
  const [sortBy, setSortBy] = useState("");

  // sort by options as srings
  const sortByOptions = {
    LIST_NAME: searchRankings ? "Ranking name" : "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };

  const placeholder = sortByOptions.LIST_NAME;

  useEffect(() => {
    fetchAllNames();

    // only fetch ranking names or template names
    if (searchRankings) {
      fetchRankingNames();
    } else {
      fetchTemplateNames();
    }

    fetchUserNames();

    if (!id) {
      fetchTagNames();
    }
  }, []);

  /**
   * Fetches all names to be used from the database.
   * If an ID is specified, retrieves ranking and user names related
   * to a specified template ID. Otherwise retrieves all ranking or template
   * names and usernames depending on searchRankings status
   */
  const fetchAllNames = async () => {
    if (id) {
      // get all names: id edition
      getAllRankingNames(id)
        .then((rankNames) => {
          const temp = [];
          temp.push(...rankNames);
          fetchAllUsersWithRankings(id).then((users) => {
            const tempUsers = users.map((u) => u.user_name);
            temp.push(...tempUsers);
          });
          return temp;
        })
        .then((t) => {
          setAllNames(t);
        })
        .catch((err) => console.log(err));
    } else if (searchRankings) {
      // get all names: ranking edition
      getAllRankingNames()
        .then((rankNames) => {
          const temp = [];
          temp.push(...rankNames);
          fetchAllUsersWithRankings().then((users) => {
            const tempUsers = users.map((u) => u.user_name);
            temp.push(...tempUsers);
          });
          return temp;
        })
        .then((t) => {
          setAllNames(t);
        })
        .catch((err) => console.log(err));
    } else {
      // get all names: template edition
      getAllTemplateNames()
        .then((tempNames) => {
          const temp = [];
          temp.push(...tempNames);
          fetchAllUsersWithTemplates().then((users) => {
            const tempUsers = users.map((u) => u.user_name);
            temp.push(...tempUsers);
          });
          return temp;
        })
        .then((t) => {
          setAllNames(t);
        })
        .catch((err) => console.log(err));
    }
  };

  /**
   * Fetches and sets the ranking names for search suggestions
   */
  const fetchRankingNames = async () => {
    if (id) {
      // if id is specified
      const rankNames = await getAllRankingNames(id);
      if (rankNames.length > 0) {
        setRankingNames(rankNames);
      }
    } else {
      // if id is not specified
      const rankNames = await getAllRankingNames();
      if (rankNames.length > 0) {
        setRankingNames(rankNames);
      }
    }
  };

  /**
   * Fetches and sets template names for search suggestions
   */
  const fetchTemplateNames = async () => {
    const tempNames = await getAllTemplateNames();
    if (tempNames.length > 0) {
      setTemplateNames(tempNames);
    }
  };

  /**
   * Fetches and sets user names for search suggestions
   */
  const fetchUserNames = async () => {
    if (id) {
      // user names who have made rankings with specific id
      fetchAllUsersWithRankings(id)
        .then((data) => setUserNames(data.map((u) => u.user_name)))
        .catch((err) => console.log(err));
    } else if (searchRankings) {
      // user names who have made rankings
      fetchAllUsersWithRankings()
        .then((data) => setUserNames(data.map((u) => u.user_name)))
        .catch((err) => console.log(err));
    } else {
      // user names who have made templates
      fetchAllUsersWithTemplates()
        .then((data) => setUserNames(data.map((u) => u.user_name)))
        .catch((err) => console.log(err));
    }
  };

  /**
   * Fetches tag names and count of the templates/rankings using said tag
   * from the database
   */
  const fetchTagNames = async () => {
    const tagCount = searchRankings ? "rcount=true" : "count=true";
    fetchAllTagsFiltered(tagCount)
      .then((data) => {
        const tagData = data;
        tagData.map((t) => (t.check = false));
        setTags(tagData);
      })
      .catch((err) => console.log(err));
  };

  // search input handlers
  const handleSearchInput = (val) => setSearchInput(val);
  const handleRankingName = (val) => setSearchRanking(val);
  const handleTemplateName = (val) => setSearchTemplate(val);
  const handleCreatorName = (val) => setSearchUser(val);
  const selectFromDropdown = (val) => setSortBy(val);

  /**
   * Opens and closes the advances search menu
   */
  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  /**
   * Handles clearing all selected search filters
   */
  const handleClear = () => {
    const clearChecks = [...tags];
    setSortBy("");
    clearChecks.forEach((t) => (t.check = false));
    setTags(clearChecks);
    clear();
  };

  /**
   * Constructs the final search query and sends it to callback function
   */
  const handleSearch = () => {
    let searchQuery = "";
    let searchConditions = [];

    if (!searchRankings) {
      const checkedTags = tags.filter((t) => t.check).map((t) => t.id);
      if (checkedTags.length > 0) {
        const tagSearch = checkedTags.map((tag) => `tag=${tag}`).join("&");
        searchConditions.push(tagSearch);
      }
    }

    if (searchInput.trim() !== "") {
      searchConditions.push(`search=${searchInput.trim()}`);
    }

    if (searchRanking.trim() !== "") {
      searchConditions.push(`rname=${searchRanking.trim()}`);
    }

    if (searchTemplate.trim() !== "") {
      searchConditions.push(`tname=${searchTemplate.trim()}`);
    }
    if (searchUser.trim() !== "") {
      searchConditions.push(`uname=${searchUser.trim()}`);
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

    // send final string forward
    if (searchQuery !== "") {
      console.log("Sending " + searchQuery);
      search(searchQuery);
    }
  };

  /**
   * Sets a tag from specified index to be selected
   * @param {number} index - index of the selected tag
   */
  const tagCheck = (index) => {
    const checkedTag = [...tags];
    checkedTag[index].check = !tags[index].check;
    setTags(checkedTag);
  };

  return (
    <div className="searchContainer">
      {/* Search from all */}
      <label>Search: </label>
      <SearchInput
        suggestionData={allNames}
        onChange={handleSearchInput}
        onSelected={handleSearchInput}
      />

      {/* Filter box */}
      {filtersOpen ? (
        <div className="filtersContainer">
          <div>
            <h3>Advanced search:</h3>
            {searchRankings ? (
              <div className="searchInput">
                {/* Ranking name search */}
                <label>Search ranking by name: </label>
                <SearchInput
                  suggestionData={rankingNames}
                  onChange={handleRankingName}
                  onSelected={handleRankingName}
                />
              </div>
            ) : (
              <div className="searchInput">
                {/* Template name search */}
                <label>Search template by name: </label>
                <SearchInput
                  suggestionData={templateNames}
                  onChange={handleTemplateName}
                  onSelected={handleTemplateName}
                />
              </div>
            )}

            <div className="searchInput">
              {/* Username search */}
              <label>Search from creator: </label>
              <SearchInput
                suggestionData={userNames}
                onChange={handleCreatorName}
                onSelected={handleCreatorName}
              />
            </div>

            {!id && (
              <ul className="tagFilters">
                {tags.map((tag, index) => (
                  <li key={"tag" + index} onClick={() => tagCheck(index)}>
                    <input
                      type="checkbox"
                      checked={tag.check}
                      onChange={() => tagCheck(index)}
                    />
                    {tag.name} ({tag.count})
                  </li>
                ))}
              </ul>
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

      <button type="button" onClick={handleSearch} className="searchButton">
        Search
      </button>
    </div>
  );
}

FilteredSearch.propTypes = {
  search: PropTypes.func,
  clear: PropTypes.func,
  searchRankings: PropTypes.bool.isRequired,
  id: PropTypes.number,
};

export default FilteredSearch;
