import { useState, useEffect } from "react";
import { deleteRanking, fetchAllRankingsFiltered } from "./api";
import FilteredSearch from "./FilteredSearch";
import { checkAdminStatus } from "./util";
import ButtonPrompt from "./ButtonPrompt";

function BrowSeRankings() {
  const [rankings, setRankings] = useState([]);
  const [filters, setFilters] = useState("sortBy=id&sortOrder=desc");
  const [isDefaultSearch, setIsDefaultSearch] = useState(true);
  const [loadedLists, setLoadedLists] = useState(0);
  const loadSize = 5;

  useEffect(() => {
    fetchRecent();
  }, []);

  async function fetchRecent() {
    fetchAllRankingsFiltered(`sortBy=id&sortOrder=desc&limit=${loadSize}`)
      .then((data) => {
        setFilters("sortBy=id&sortOrder=desc");
        setIsDefaultSearch(true);
        setRankings(data);
        setLoadedLists(loadSize);
      })
      .catch((err) => console.log(err));
  }

  async function newSearch(query) {
    fetchAllRankingsFiltered(`${query}&limit=${loadSize}`)
      .then((data) => {
        setIsDefaultSearch(false);
        setRankings(data);
        setLoadedLists(loadSize);
      })
      .catch((err) => console.log(err));
  }

  // load more templates with current search filters
  async function loadMore() {
    let limit = `${loadedLists},${loadSize}`;
    console.log(limit);
    fetchAllRankingsFiltered(`${filters}&limit=${limit}`)
      .then((data) => {
        if (loadedLists === 0) {
          setRankings(data);
        } else {
          setRankings((prevRanks) => [...prevRanks, ...data]);
        }
        setLoadedLists(loadedLists + loadSize);
      })
      .catch((err) => console.log(err));
  }

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

  return (
    <>
      <h1>Browse rankings</h1>
      <FilteredSearch
        search={handleFilteredSearch}
        clear={fetchRecent}
        searchRankings={true}
      />

      <div>
        {/* Title */}
        {isDefaultSearch ? <h2>Recent rankings</h2> : <h2>Search results</h2>}
        <ul>
          {rankings.map((t) => (
            <li key={t.ranking_id}>
              <h3>{t.ranking_name}</h3>
              <p>Creator: {t.user_name ? t.user_name : "Anonymous"}</p>
              <p>Template: {t.template_id}</p>
              <ul>
                {JSON.parse(t.ranked_items).map((item, index) => (
                  <li key={index}>{item.item_name}</li>
                ))}
              </ul>

              {checkAdminStatus() && (
                <ButtonPrompt
                  buttonName="Delete ranking"
                  confirm={() => handleDelete(t.ranking_id)}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Load more button */}
        <button type="button" onClick={loadMore}>
          Load more
        </button>
      </div>
    </>
  );
}

export default BrowSeRankings;
