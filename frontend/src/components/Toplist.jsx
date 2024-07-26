import { Link } from "react-router-dom";
import { formatDate } from "../util/misc";
import ButtonPrompt from "./ButtonPrompt";
import { isAdmin } from "../util/permissions";
import { deleteToplist } from "../api/toplists";
import ToplistData from "./ToplistData";

/**
 * Reusable component displaying top list title and data
 *
 * @param {object} props.data - Top list data to be displayed
 * @param {boolean} props.general - whether the top list should display
 * information about the template or no.
 * @param {boolean} props.showCreator - whether to display the creator name,
 * true by default
 * @returns {JSX.Element} Top list preview component
 */
function Toplist({ data, general, showCreator = true }) {
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
      <Link to={`/toplists/${data.toplist_id}`}>
        {general ? <h3>{data.toplist_name}</h3> : <h2>{data.toplist_name}</h2>}
      </Link>

      <ToplistData
        data={data}
        showTemplate={general}
        showCreator={showCreator}
      />
    </>
  );
}

export default Toplist;
