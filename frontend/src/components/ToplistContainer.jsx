import { useEffect, useState } from "react";
import { fetchAllRankingsFiltered, fetchRankingCount } from "./api";
import { formatData, getCountFromData } from "../util/dataHandler";
import Toplist from "./Toplist";
import FilteredSearch from "./FilteredSearch";

function ToplistContainer(props) {
  const templateId = props.id ? props.id : 0;
  const defaultQuery = `sortBy=id&sortOrder=desc`;
  const [toplists, setToplists] = useState([]);
  const [listCount, setListCount] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadMoreAmount = 1;
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultQuery);

  useEffect(() => {
    getListCount();
  }, []);

  useEffect(() => {
    loadLists();
  }, [listCount]);

  const getListCount = async () => {
    fetchRankingCount(templateId)
      .then((data) => {
        const count = getCountFromData(data);
        setListCount(count);
      })
      .catch((err) => console.log(err));
  };

  const loadLists = async (loadMore = false) => {
    const loaded = loadMore ? loadedCount : 0;

    // Don't fetch more than the database has
    let newLoadSize = loadMoreAmount;
    if (loaded + loadMoreAmount > listCount) {
      const overFlow = loaded + loadMoreAmount - listCount;
      newLoadSize -= overFlow;
    }

    let q = templateId > 0 ? `tempId=${templateId}&` : ``;
    q += `${filters}`;
    fetchAllRankingsFiltered(`${q}&from=${loaded}&amount=${newLoadSize}`)
      .then((data) => {
        const formattedData = formatData(data);
        setToplists(formattedData);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Sets the specified filters and calls for a new search
   * @param {string} val - filtered query text
   */
  const handleFilteredSearch = (val) => {
    setFilters(val === "" ? defaultQuery : val);
  };

  const handleClear = () => {
    setFilters(defaultQuery);
  };

  return (
    <div className="rankingsCont">
      {templateId > 0 && <h2>Lists using this template</h2>}
      <FilteredSearch
        search={handleFilteredSearch}
        clear={handleClear}
        searchRankings={true}
        id={templateId}
      />

      {!loading && listCount < 1 && <p>No templates found</p>}
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="lists">
          {toplists.map((list) => (
            <div key={list.toplist_id} className="rank-container">
              <Toplist data={list} general={templateId < 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ToplistContainer;
