import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getRankingNames } from "./util";
import { fetchAllRankingsFiltered, fetchAllUsersWithRankings } from "./api";
import SearchInput from "./SearchInput";

function ShowRankings({ id }) {
  const [loadedRankings, setLoadedRankings] = useState([]);
  const [rankCount, setRankCount] = useState(0);
  const loadSize = 2;
  const defaultQuery = `sortBy=id&sortOrder=desc`;

  const [openFilters, setOpenFilters] = useState(false);
  const [searchRanking, setSearchRanking] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [userNames, setUserNames] = useState([]);
  const [listNames, setListNames] = useState([]);

  useEffect(() => {
    fetchRankingNames();
    handleFetchUserNames();
    getAllRankings();
  }, []);

  const getAllRankings = async () => {
    fetchAllRankingsFiltered(`tempId=${id}&${defaultQuery}&limit=${loadSize}`)
      .then((data) => {
        setLoadedRankings(data);
        setRankCount(loadSize);
      })
      .catch((err) => console.log(err));
  };

  const loadMore = async () => {
    let limit = `${rankCount},${loadSize}`;
    fetchAllRankingsFiltered(`tempId=${id}&${defaultQuery}&limit=${limit}`)
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
        <div key={list.ranking_id}>{list.ranking_name}</div>
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
