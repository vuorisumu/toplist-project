import { useState, useEffect } from "react";
import {
  fetchAllRankings,
  fetchAllRankingsFiltered,
  fetchAllTemplatesFiltered,
  fetchAllUsersWithTemplates,
} from "./api";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

function BrowSeRankings() {
  const [rankings, setRankings] = useState([]);
  const [rankingNames, setRankingNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchRanking, setSearchRanking] = useState("");
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
    getRankingNames();
    getTemplateNames();
    getUserNames();
  }, []);

  const fetchRecent = async () => {
    console.log("fetch recent");
  };

  const getRankingNames = async () => {
    fetchAllRankingsFiltered("distinct=true")
      .then((data) => setRankingNames(data.map((r) => r.ranking_name)))
      .catch((err) => console.log(err));
  };

  const getTemplateNames = async () => {
    fetchAllTemplatesFiltered("distinct=true")
      .then((data) => setTemplateNames(data.map((t) => t.name)))
      .catch((err) => console.log(err));
  };

  const getUserNames = async () => {
    fetchAllUsersWithTemplates()
      .then((data) => setUserNames(data.map((u) => u.user_name)))
      .catch((err) => console.log(err));
  };

  async function fetchAll() {
    fetchAllRankings()
      .then((data) => setRankings(data))
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchAllFiltered(filters) {
    fetchAllRankingsFiltered(filters)
      .then((data) => setRankings(data))
      .catch((err) => console.log(err));
  }

  const handleRankingName = (val) => {
    setSearchRanking(val);
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

  const filteredSearch = () => {
    console.log("Search button");
  };

  const toggleFilterMenu = () => {
    setFiltersOpen(!filtersOpen);
  };

  const test = () => {
    fetchAll();
    console.log(rankingNames);
  };

  return (
    <>
      <h1>Browse</h1>
      <button onClick={test}>Test button</button>
      <br />

      {/* Filter box */}
      {filtersOpen ? (
        <div>
          <div>
            <h2>Filter rankings</h2>

            {/* Ranking name search */}
            <label>Search ranking by name: </label>
            <SearchInput
              suggestionData={rankingNames}
              onChange={handleRankingName}
              onSelected={handleRankingName}
            />

            {/* Template name search */}
            <label>Search by template name: </label>
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
        <ul>
          {rankings.map((t) => (
            <li key={t.ranking_id}>
              <h2>{t.ranking_name}</h2>
              <p>Creator: {t.user_name ? t.user_name : "Anonymous"}</p>
              <p>Template: {t.template_id}</p>
              <ul>
                {JSON.parse(t.ranked_items).map((item, index) => (
                  <li key={index}>{item.item_name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default BrowSeRankings;
