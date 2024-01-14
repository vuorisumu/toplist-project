import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatDate } from "./util";
import { fetchRankingById } from "./api";

function Ranking() {
  const location = useLocation();
  const navigate = useNavigate();
  const rankingId = parseInt(location.pathname.replace("/rankings/", ""));
  if (isNaN(rankingId)) {
    console.error("Invalid ranking id: ", rankingId);
  }

  const [list, setList] = useState(null);

  useEffect(() => {
    fetchRankingById(rankingId)
      .then((data) => setList(data[0]))
      .catch((err) => console.log(err));
  }, []);

  if (!list) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <h2>{list.ranking_name}</h2>
      <div>
        <p>
          Template:{" "}
          <Link to={`/createlisting/${list.template_id}`}>{list.name}</Link>
        </p>
        <p>Creator: {list.user_name || "Anonymous"}</p>
        <p>Creation date: {formatDate(list.creation_time)}</p>
        {list.ranking_desc && <p>{list.ranking_desc}</p>}
      </div>

      <div>
        <ol>
          {JSON.parse(list.ranked_items).map((item, index) => (
            <li key={"item" + index}>
              <p>{item.item_name}</p>
              {item.item_note && <p>{item.item_note}</p>}
            </li>
          ))}
        </ol>
      </div>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default Ranking;
