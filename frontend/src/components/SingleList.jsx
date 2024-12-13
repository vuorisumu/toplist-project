import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../util/misc";
import ButtonPrompt from "./ButtonPrompt";
import { formatData } from "../util/dataHandler";
import { isAdmin } from "../util/permissions";
import { deleteToplist, fetchToplistById } from "../api/toplists";
import ToplistData from "./ToplistData";
import ListData from "./ListData";

/**
 * View of a single ranking rendering all information related to the top list
 * and a back button.
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
    fetchToplistById(rankingId)
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
    deleteToplist(rankingId)
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
        <ToplistData data={list} showTemplate={true} showCreator={true} />

        <button onClick={() => navigate(-1)} className="backButton">
          Back
        </button>
      </div>

      <ListData
        data={list}
        templateId={list.template_id}
        submitText={"Update top list"}
      />
    </div>
  );
}

export default SingleList;
