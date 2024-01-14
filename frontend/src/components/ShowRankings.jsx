import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { formatDate } from "./util";
import { fetchAllRankingsFiltered } from "./api";
import FilteredSearch from "./FilteredSearch";

function ShowRankings({ id }) {
  const [loadedRankings, setLoadedRankings] = useState([]);
  const [rankCount, setRankCount] = useState(0);
  const loadSize = 2;
  const defaultQuery = `sortBy=id&sortOrder=desc`;
  const [filters, setFilters] = useState(defaultQuery);

  useEffect(() => {
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

  const handleFilteredSearch = (val) => {
    setFilters(val);
    newSearch(val);
  };

  if (!loadedRankings) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <h2>Lists using this template</h2>
      <FilteredSearch
        search={handleFilteredSearch}
        clear={loadDefaultRankings}
        searchRankings={true}
        id={id}
      />
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
