import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchAllRankingsFiltered } from "./api";

function ShowRankings({ id }) {
  const [allRankings, setAllRankings] = useState([]);
  const [loadedRankings, setLoadedRankings] = useState([]);
  const [loadedLists, setLoadedLists] = useState(0);
  const loadSize = 5;
  const defaultQuery = `sortBy=id&sortOrder=desc`;

  useEffect(() => {
    getAllRankings();
  }, []);

  const getAllRankings = async () => {
    fetchAllRankingsFiltered(`tempId=${id}&${defaultQuery}&limit=${loadSize}`)
      .then((data) => {
        setLoadedRankings(data);
        setLoadedLists(loadSize);
      })
      .catch((err) => console.log(err));
  };

  const loadMore = () => {
    console.log("Load more");
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
