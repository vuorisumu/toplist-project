import { useEffect, useState } from "react";
import { fetchAllRankingsFiltered, fetchRankingCount } from "./api";
import { formatData, getCountFromData } from "../util/dataHandler";
import Toplist from "./Toplist";
import AdvancedSearch from "./AdvancedSearch";

/**
 * Container for displaying the top lists and the search bar.
 * Displays the search bar with filters and top lists fetched from the
 * database. If the id is given, displays top lists only using that template id.
 * @param {number} props.templateId - The ID of the template to be used when
 * fetching from the database. Defaults to 0, meaning no template was chosen.
 */
function ToplistContainer({ templateId = 0 }) {
  const defaultQuery = `sortBy=id&sortOrder=desc`;
  const [toplists, setToplists] = useState([]);
  const [listCount, setListCount] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadMoreAmount = 5;
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultQuery);

  useEffect(() => {
    getListCount();
  }, []);

  useEffect(() => {
    if (listCount > 0) {
      loadLists();
    }
  }, [listCount]);

  /**
   * Fetches the full list count and sets the count value to state.
   * If the count is 0, set loading to false.
   */
  const getListCount = async () => {
    fetchRankingCount(templateId)
      .then((data) => {
        const count = getCountFromData(data);
        setListCount(count);
        if (count <= 0) setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Loads lists from the database. Overwrites the loaded lists on fresh
   * search, and adds to previously loaded if the user chose to load more.
   * @param {boolean} loadMore - False by default. If set to true, loads
   * more lists starting from the last loaded row and adds them to state
   * instead of overwriting.
   */
  const loadLists = async (loadMore = false) => {
    const loaded = loadMore ? loadedCount : 0;

    let q = templateId > 0 ? `tempId=${templateId}&` : ``;
    q += `${filters}`;
    fetchAllRankingsFiltered(`${q}&from=${loaded}&amount=${loadMoreAmount}`)
      .then((data) => {
        const formattedData = formatData(data);
        if (!loadMore) {
          setToplists(formattedData);
          setLoading(false);
        } else {
          setToplists((prev) => [...prev, ...formattedData]);
        }
        setLoadedCount(loaded + loadMoreAmount);
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

  /**
   * Sets the filters bacn to default.
   */
  const handleClear = () => {
    setFilters(defaultQuery);
  };

  return (
    <div className="rankingsCont">
      {templateId > 0 && <h2>Lists using this template</h2>}

      {/* Search container */}
      <AdvancedSearch
        searchLists={true}
        onSearch={handleFilteredSearch}
        onClear={handleClear}
        templateId={templateId}
      />

      {!loading && listCount < 1 && <p>No templates found</p>}
      {loading ? (
        <p>Loading</p>
      ) : (
        <>
          <div className="lists">
            {toplists.map((list) => (
              <div key={list.toplist_id} className="rank-container">
                <Toplist data={list} general={templateId < 1} />
              </div>
            ))}
          </div>

          {/* Load more button */}
          {toplists.length > 0 && loadedCount < listCount && (
            <button
              type="button"
              onClick={() => loadLists(true)}
              className="loadMoreButton"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default ToplistContainer;
