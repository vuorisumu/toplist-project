import { Link } from "react-router-dom";
import { formatDate } from "../util/misc";
import ButtonPrompt from "./ButtonPrompt";
import { deleteRanking } from "./api";
import { isAdmin } from "../util/permissions";

/**
 * Reusable component displaying top list data.
 *
 * @param {object} props.data - Top list data to be displayed
 * @param {boolean} props.general - whether the top list should display
 * information about the template or no.
 * @returns {JSX.Element} Top list preview component
 */
function Toplist({ data, general }) {
  /**
   * Deletes the top list from the database.
   */
  const handleDelete = () => {
    deleteRanking(data.toplist_id)
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Link to={`/toplists/${data.toplist_id}`}>
        {general ? <h3>{data.toplist_name}</h3> : <h2>{data.toplist_name}</h2>}
      </Link>

      <p>List creator: {data.user_name || "Anonymous"}</p>
      {general && (
        <p>
          Template:{" "}
          {data.name ? (
            <Link to={`/createlist/${data.template_id}`}>{data.name}</Link>
          ) : (
            "[Deleted]"
          )}
        </p>
      )}
      <p>Creation time: {formatDate(data.creation_time)}</p>
      {data.toplist_desc && <p>{data.toplist_desc}</p>}

      <ol className="rank">
        {data.ranked_items.map((item) => (
          <li key={`${data.toplist_id} ${item.rank_number}`}>
            <p>{item.item_name}</p>
            {item.item_note && <p className="itemNote">{item.item_note}</p>}
          </li>
        ))}
      </ol>

      {isAdmin() && (
        <ButtonPrompt
          buttonName="Delete top list"
          confirm={() => handleDelete(data.toplist_id)}
        />
      )}
    </>
  );
}

export default Toplist;
