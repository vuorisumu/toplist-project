import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getRankingNames, formatDate } from "./util";
import { fetchAllRankingsFiltered, fetchAllUsersWithRankings } from "./api";
import SearchInput from "./SearchInput";
import Dropdown from "./Dropdown";

function ShowRankings({ id }) {
  const [loadedRankings, setLoadedRankings] = useState([]);
  const [rankCount, setRankCount] = useState(0);
  const loadSize = 2;
  const defaultQuery = `sortBy=id&sortOrder=desc`;

  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState(defaultQuery);
  const [searchRanking, setSearchRanking] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [userNames, setUserNames] = useState([]);
  const [listNames, setListNames] = useState([]);

  // sort by options as srings
  const sortByOptions = {
    LIST_NAME: "List name",
    CREATOR_NAME: "Creator name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
  };

  useEffect(() => {
    fetchRankingNames();
    handleFetchUserNames();
    newSearch(defaultQuery);
  }, []);

  const loadDefaultRankings = async () => {
    fetchAllRankingsFiltered(`tempId=${id}&${defaultQuery}&limit=${loadSize}`)
      .then((data) => {
        setLoadedRankings(data);
        setRankCount(loadSize);
      })
      .catch((err) => console.log(err));
  };

  const newSearch = async (query) => {
    fetchAllRankingsFiltered(`tempId=${id}&${query}&limit=${loadSize}`)
      .then((data) => {
        setLoadedRankings(data);
        setRankCount(loadSize);
      })
      .catch((err) => console.log(err));
  };

  const loadMore = async () => {
    let limit = `${rankCount},${loadSize}`;
    fetchAllRankingsFiltered(`tempId=${id}&${filters}&limit=${limit}`)
      .then((data) => {
        if (rankCount === 0) {
          setLoadedRankings(data);
        } else {
          setLoadedRankings((prevTemplates) => [...prevTemplates, ...data]);
        }
        setRankCount(rankCount + loadSize);
      })
      .catch((err) => console.log(err));
  };

  const toggleShowFilters = () => {
    setOpenFilters(!openFilters);
  };

  const handleRankingName = (val) => {
    setSearchRanking(val);
  };

  const handleCreatorName = (val) => {
    setSearchUser(val);
  };

  const selectFromDropdown = (val) => {
    setSortBy(val);
  };

  async function fetchRankingNames() {
    const fetchedNames = await getRankingNames(id);
    if (fetchedNames.length > 0) {
      setListNames(fetchedNames);
    }
  }

  const handleFetchUserNames = async () => {
    fetchAllUsersWithRankings(id)
      .then((data) => setUserNames(data.map((u) => u.user_name)))
      .catch((err) => console.log(err));
  };

  const filteredSearch = async () => {
    console.log("Search");
    let searchQuery = "";
    let searchConditions = [];

    if (searchRanking.trim() !== "") {
      searchConditions.push(`tname=${searchRanking.trim()}`);
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

    if (searchQuery !== "") {
      setFilters(searchQuery);
      newSearch(searchQuery);
    }
  };

  if (!loadedRankings) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <h2>Lists using this template</h2>
      <div>
        {openFilters ? (
          <div>
            {/* Ranking name search */}
            <label>Search list by name: </label>
            <SearchInput
              suggestionData={listNames}
              onChange={handleRankingName}
              onSelected={handleRankingName}
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
              placeholder={"List name"}
              items={Object.values(sortByOptions)}
              onSelect={selectFromDropdown}
            />

            <button type="button" onClick={filteredSearch}>
              Search
            </button>
            <button type="button" onClick={loadDefaultRankings}>
              Clear filters
            </button>

            <button type="button" onClick={toggleShowFilters}>
              Close filters
            </button>
          </div>
        ) : (
          <button type="button" onClick={toggleShowFilters}>
            Show filters
          </button>
        )}
      </div>
      {loadedRankings.map((list) => (
        <div key={list.ranking_id}>
          <h3>{list.ranking_name}</h3>
          <p>List creator: {list.user_name || "Anonymous"}</p>
          <p>Creation date: {formatDate(list.creation_time)}</p>
          {list.ranking_desc && <p>{list.ranking_desc}</p>}

          <ol>
            {JSON.parse(list.ranked_items).map((i) => (
              <li key={list.ranking_id + " " + i.rank_number}>
                <p>{i.item_name}</p>
                {i.item_note && <p>{i.item_note}</p>}
              </li>
            ))}
          </ol>
        </div>
      ))}

      <button type="button" onClick={loadMore}>
        Load more
      </button>
    </div>
  );
}

ShowRankings.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ShowRankings;
