import { Link } from "react-router-dom";
import { formatDate } from "./util";

function Toplist(props) {
  const data = props.data;
  const general = props.general;

  return (
    <>
      <Link to={`/toplists/${data.toplist_id}`}>
        {general ? <h3>{data.toplist_name}</h3> : <h2>{data.toplist_name}</h2>}
      </Link>

      <p>List creator: {data.user_name || "Anonymous"}</p>
      {general && (
        <p>
          Template:{" "}
          <Link to={`/createlist/${data.template_id}`}>{data.name}</Link>
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
    </>
  );
}

export default Toplist;
