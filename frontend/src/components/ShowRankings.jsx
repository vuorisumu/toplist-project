import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchAllRankingsFiltered } from "./api";

function ShowRankings({ id }) {
  const [allRankings, setAllRankings] = useState([]);
  const [loadedRankings, setLoadedRankings] = useState([]);
  const [rankCount, setRankCount] = useState(0);
  const loadSize = 2;
  const defaultQuery = `sortBy=id&sortOrder=desc`;

  useEffect(() => {
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

  if (!loadedRankings) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <h2>Lists using this template</h2>
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
