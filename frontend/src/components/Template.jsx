import { Link } from "react-router-dom";

function Template(props) {
  const data = props.data;

  return (
    <>
      <Link to={`/createlist/${data.id}`}>
        <h2>{data.name}</h2>{" "}
      </Link>
      <p className="creator">
        Creator:
        {data.user_name ? data.user_name : "Anonymous"}
      </p>

      {data.description && <p className="description">{data.description}</p>}

      <div>
        <h4>Items in the template:</h4>
        <ul>
          {data.items.map((item, index) => (
            <li key={index}>{item.item_name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Template;
