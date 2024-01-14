import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { formatDate, checkAdminStatus } from "./util";
import { fetchAllRankingsFiltered, deleteRanking } from "./api";
import FilteredSearch from "./FilteredSearch";
import ButtonPrompt from "./ButtonPrompt";

function ShowRankings({ id }) {
  const [loadedRankings, setLoadedRankings] = useState([]);
  const [rankCount, setRankCount] = useState(0);
  const loadSize = 5;
  const defaultQuery = `sortBy=id&sortOrder=desc`;
  const [filters, setFilters] = useState(defaultQuery);

  useEffect(() => {
    newSearch(defaultQuery);
  }, []);

  const loadDefaultRankings = async () => {
    let q = id > 0 ? `tempId=${id}&` : ``;
    q += `${defaultQuery}&limit=${loadSize}`;
    fetchAllRankingsFiltered(q)
      .then((data) => {
        setLoadedRankings(data);
        setRankCount(loadSize);
      })
      .catch((err) => console.log(err));
  };

  const newSearch = async (query) => {
    let q = id > 0 ? `tempId=${id}&` : ``;
    q += `${query}&limit=${loadSize}`;
    fetchAllRankingsFiltered(q)
      .then((data) => {
        setLoadedRankings(data);
        setRankCount(loadSize);
      })
      .catch((err) => console.log(err));
  };

  const loadMore = async () => {
    let limit = `${rankCount},${loadSize}`;
    let q = id > 0 ? `tempId=${id}&` : ``;
    q += `${filters}&limit=${limit}`;
    fetchAllRankingsFiltered(q)
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

  const handleDelete = (id) => {
    deleteRanking(id)
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  if (!loadedRankings) {
    return <p>Loading</p>;
  }

  return (
    <div>
      {id > 0 && <h2>Lists using this template</h2>}
      <FilteredSearch
        search={handleFilteredSearch}
        clear={loadDefaultRankings}
        searchRankings={true}
        id={id}
      />
      {loadedRankings.map((list) => (
        <div key={list.ranking_id}>
          <Link to={`/rankings/${list.ranking_id}`}>
            <h3>{list.ranking_name}</h3>
          </Link>
          <p>List creator: {list.user_name || "Anonymous"}</p>
          {id === 0 && (
            <p>
              Template:{" "}
              <Link to={`/createlisting/${list.template_id}`}>{list.name}</Link>
            </p>
          )}
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

          {checkAdminStatus() && (
            <ButtonPrompt
              buttonName="Delete ranking"
              confirm={() => handleDelete(list.ranking_id)}
            />
          )}
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
