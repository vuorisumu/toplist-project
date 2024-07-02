import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../util/misc";
import { fetchRankingById, deleteRanking } from "./api";
import ButtonPrompt from "./ButtonPrompt";
import { formatData } from "../util/dataHandler";
import { isAdmin } from "../util/permissions";

/**
 * View of a single ranking rendering all information related to the ranking
 * and a back button. Also renders a delete button if the user is logged in as
 * admin
 *
 * @returns {JSX.Element} Component displaying a single top list
 */
function SingleList() {
  const location = useLocation();
  const navigate = useNavigate();
  const rankingId = parseInt(location.pathname.replace("/toplists/", ""));
  if (isNaN(rankingId)) {
    console.error("Invalid toplist id: ", rankingId);
  }

  const [list, setList] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchRankingById(rankingId)
      .then((data) => {
        const formattedData = formatData(data);
        if (formattedData.length > 0) {
          setList(formatData(data)[0]);
        } else {
          setNotFound(true);
        }
      })
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
    return (
      <div className="container">
        <p>{`Ranking doesn't exist or it has been deleted`}</p>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="container">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="rank-container no-title">
        <h2>{list.toplist_name}</h2>
        <div className="rank-info">
          <p>
            Template:{" "}
            {list.name ? (
              <Link to={`/createlist/${list.template_id}`}>{list.name}</Link>
            ) : (
              "[Deleted]"
            )}
          </p>

          <p>
            Creator:{" "}
            {list.user_name ? (
              <Link to={`/user/${list.user_name}`}>{list.user_name}</Link>
            ) : (
              "Anonymous"
            )}
          </p>

          <p>Creation date: {formatDate(list.creation_time)}</p>
          {list.toplist_desc && <p>{list.toplist_desc}</p>}
        </div>

        <div>
          <ol className="rank">
            {list.ranked_items.map((item, index) => (
              <li key={"item" + index}>
                <p>{item.item_name}</p>
                {item.item_note && <p className="itemNote">{item.item_note}</p>}
              </li>
            ))}
          </ol>
        </div>

        {isAdmin() && (
          <ButtonPrompt buttonName="Delete ranking" confirm={handleDelete} />
        )}

        <button onClick={() => navigate(-1)} className="backButton">
          Back
        </button>
      </div>
    </div>
  );
}

export default SingleList;
