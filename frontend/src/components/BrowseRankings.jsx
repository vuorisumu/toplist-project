import { useState } from "react";
import { fetchAllRankings, fetchAllRankingsFiltered } from "./api";

function BrowSeRankings() {
  const [rankings, setRankings] = useState([]);

  async function fetchAll() {
    fetchAllRankings()
      .then((data) => setRankings(data))
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchAllFiltered(filters) {
    fetchAllRankingsFiltered(filters)
      .then((data) => setRankings(data))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <h1>Browse</h1>
      <button onClick={fetchAll}>Fetch all</button>
      <button onClick={() => fetchAllFiltered("sortBy=creatorname")}>
        Sort by creator name
      </button>
      <ul>
        {rankings.map((t) => (
          <li key={t.ranking_id}>
            <h2>{t.ranking_name}</h2>
            <p>Creator: {t.user_name ? t.user_name : "Anonymous"}</p>
            <p>Template: {t.template_id}</p>
            <ul>
              {JSON.parse(t.items).map((item, index) => (
                <li key={index}>{item.item_name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default BrowSeRankings;
