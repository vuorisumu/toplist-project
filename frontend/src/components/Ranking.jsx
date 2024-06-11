import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatDate, checkAdminStatus } from "./util";
import { fetchRankingById, deleteRanking } from "./api";
import ButtonPrompt from "./ButtonPrompt";

/**
 * View of a single ranking rendering all information related to the ranking
 * and a back button. Also renders a delete button if the user is logged in as
 * admin
 */
function Ranking() {
  const location = useLocation();
  const navigate = useNavigate();
  const rankingId = parseInt(location.pathname.replace("/toplists/", ""));
  if (isNaN(rankingId)) {
    console.error("Invalid ranking id: ", rankingId);
  }

  const [list, setList] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchRankingById(rankingId)
      .then((data) => setList(data[0]))
      .catch((err) => {
        setNotFound(true);
        console.log(err);
      });
  }, []);

  /**
   * Deletes a ranking from the database and refreshes the page
   */
  const handleDelete = () => {
    deleteRanking(rankingId)
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  if (notFound) {
    return <p>{`Ranking doesn't exist or it has been deleted`}</p>;
  }

  if (!list) {
    return <p>Loading</p>;
  }

  return (
    <div className="container">
      <div className="rank-container no-title">
        <h2>{list.ranking_name}</h2>
        <div className="rank-info">
          <p>
            Template:{" "}
            <Link to={`/createranking/${list.template_id}`}>{list.name}</Link>
          </p>
          <p>Creator: {list.user_name || "Anonymous"}</p>
          <p>Creation date: {formatDate(list.creation_time)}</p>
          {list.ranking_desc && <p>{list.ranking_desc}</p>}
        </div>

        <div>
          <ol className="rank">
            {JSON.parse(list.ranked_items).map((item, index) => (
              <li key={"item" + index}>
                <p>{item.item_name}</p>
                {item.item_note && <p className="itemNote">{item.item_note}</p>}
              </li>
            ))}
          </ol>
        </div>

        {checkAdminStatus() && (
          <ButtonPrompt buttonName="Delete ranking" confirm={handleDelete} />
        )}

        <button onClick={() => navigate(-1)} className="backButton">
          Back
        </button>
      </div>
    </div>
  );
}

export default Ranking;
