import { useState, useEffect } from "react";
import {
  fetchAllRankings,
  fetchAllRankingsFiltered,
  fetchAllTemplatesFiltered,
  fetchAllUsersWithTemplates,
} from "./api";

function BrowSeRankings() {
  const [rankings, setRankings] = useState([]);
  const [rankingNames, setRankingNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [templateNames, setTemplateNames] = useState([]);

  useEffect(() => {
    getRankingNames();
    getTemplateNames();
    getUserNames();
  }, []);

  const getRankingNames = async () => {
    fetchAllRankingsFiltered("distinct=true")
      .then((data) => setRankingNames(data.map((r) => r.ranking_name)))
      .catch((err) => console.log(err));
  };

  const getTemplateNames = async () => {
    fetchAllTemplatesFiltered("distinct=true")
      .then((data) => setTemplateNames(data.map((t) => t.name)))
      .catch((err) => console.log(err));
  };

  const getUserNames = async () => {
    fetchAllUsersWithTemplates()
      .then((data) => setUserNames(data.map((u) => u.user_name)))
      .catch((err) => console.log(err));
  };

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

  const test = () => {
    console.log(rankingNames);
  };

  return (
    <>
      <h1>Browse</h1>
      <button onClick={test}>Test button</button>
      <br />

      <button onClick={fetchAll}>Fetch all</button>
      <button onClick={() => fetchAllFiltered("sortBy=name")}>
        Sort alphabetically
      </button>
      <button onClick={() => fetchAllFiltered("sortBy=creatorname")}>
        Sort by creator name
      </button>
      <button onClick={() => fetchAllFiltered("sortBy=templatename")}>
        Sort by template name
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
