import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";
import PropTypes from "prop-types";
import { getAllTemplateNames } from "./util";
import { fetchAllUsersWithTemplates, fetchAllTags } from "./api";

function FilterTemplates({ search, clear }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [templateNames, setTemplateNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [tags, setTags] = useState({});
  const [searchTemplate, setSearchTemplate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [sortBy, setSortBy] = useState("");

  // sort by options as srings
  const sortByOptions = {
    TEMPLATE_NAME: "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };

  useEffect(() => {
    fetchTemplateNames();
    fetchUserNames();
    fetchTagNames();
  }, []);

  // get all template names
  const fetchTemplateNames = async () => {
    const tempNames = await getAllTemplateNames();
    if (tempNames.length > 0) {
      setTemplateNames(tempNames);
    }
  };

  // get all usernames
  const fetchUserNames = async () => {
    fetchAllUsersWithTemplates()
      .then((data) => setUserNames(data.map((u) => u.user_name)))
      .catch((err) => console.log(err));
  };

  // get all tag names
  const fetchTagNames = async () => {
    fetchAllTags()
      .then((data) => {
        const tagData = data;
        tagData.map((t) => (t.check = false));
        setTags(tagData);
      })
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

  // open and close filters
  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleClear = () => {
    clear();
  };

  // filtered template search
  const handleSearch = () => {
    let searchQuery = "";
    let searchConditions = [];

    const checkedTags = tags.filter((t) => t.check).map((t) => t.id);
    if (checkedTags.length > 0) {
      const tagSearch = checkedTags.map((tag) => `tag=${tag}`).join("&");
      searchConditions.push(tagSearch);
      console.log(tagSearch);
    }

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

    // send final string forward
    if (searchQuery !== "") {
      console.log("Sending " + searchQuery);
      search(searchQuery);
    }
  };

  const tagCheck = (index) => {
    const checkedTag = [...tags];
    checkedTag[index].check = !tags[index].check;
    setTags(checkedTag);
  };

  return (
    <>
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

            <ul>
              {tags.map((tag, index) => (
                <li key={"tag" + index} onClick={() => tagCheck(index)}>
                  <input
                    type="checkbox"
                    checked={tag.check}
                    onChange={() => tagCheck(index)}
                  />
                  {tag.name}
                </li>
              ))}
            </ul>

            {/* Sort by options */}
            <Dropdown
              label={"Sort by"}
              placeholder={"Template name"}
              items={Object.values(sortByOptions)}
              onSelect={selectFromDropdown}
            />
          </div>

          <button type="button" onClick={handleSearch}>
            Search
          </button>
          <button type="button" onClick={handleClear}>
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
    </>
  );
}

FilterTemplates.propTypes = {
  search: PropTypes.func,
  clear: PropTypes.func,
};

export default FilterTemplates;
