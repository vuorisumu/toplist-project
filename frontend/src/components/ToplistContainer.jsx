import { useEffect, useState } from "react";
import { fetchAllRankingsFiltered, fetchRankingCount } from "./api";
import { formatData, getCountFromData } from "../util/dataHandler";
import Toplist from "./Toplist";

function ToplistContainer(props) {
  const templateId = props.id ? props.id : 0;
  const defaultQuery = `sortBy=id&sortOrder=desc`;
  const [toplists, setToplists] = useState([]);
  const [listCount, setListCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListCount();
    loadLists();
  }, []);

  const getListCount = async () => {
    fetchRankingCount(templateId)
      .then((data) => {
        const count = getCountFromData(data);
        setListCount(count);
      })
      .catch((err) => console.log(err));
  };

  const loadLists = async () => {
    let q = templateId > 0 ? `tempId=${templateId}&` : ``;
    q += `${defaultQuery}`;
    fetchAllRankingsFiltered(q)
      .then((data) => {
        const formattedData = formatData(data);
        setToplists(formattedData);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="rankingsCont">
      {templateId > 0 && <h2>Lists using this template</h2>}
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
