import { Link } from "react-router-dom";
import { formatDate } from "../util/misc";
import ButtonPrompt from "./ButtonPrompt";
import { isAdmin } from "../util/permissions";
import { deleteToplist } from "../api/toplists";

/**
 * Reusable component displaying top list data.
 *
 * @param {object} props.data - Top list data to be displayed
 * @param {boolean} props.showTemplate - whether the top list should display
 * information about the template or no.
 * @param {boolean} props.showCreator - whether to display the creator name,
 * true by default
 * @returns {JSX.Element} Top list preview component
 */
function ToplistData({ data, showTemplate, showCreator }) {
  /**
   * Deletes the top list from the database.
   */
  const handleDelete = () => {
    deleteToplist(data.toplist_id)
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {showCreator && (
        <p>
          List creator:{" "}
          {data.user_name ? (
            <Link to={`/user/${data.user_name}`}>{data.user_name}</Link>
          ) : (
            "Anonymous"
          )}
        </p>
      )}

      {showTemplate && (
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

export default ToplistData;
