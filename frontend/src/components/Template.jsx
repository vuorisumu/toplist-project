import { Link } from "react-router-dom";
import { deleteTemplate } from "./api";
import { checkAdminStatus } from "./util";
import ButtonPrompt from "./ButtonPrompt";
import { useEffect, useState } from "react";
import { tagNamesByIds } from "../util/dataHandler";

function Template(props) {
  const data = props.data;
  const [tagNames, setTagNames] = useState([]);

  useEffect(() => {
    if (data.tags) {
      tagNamesByIds(data.tags)
        .then((tags) => setTagNames(tags))
        .catch((err) => console.log(err));
    }
  }, []);

  const handleDelete = () => {
    deleteTemplate(data.id)
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {checkAdminStatus() && (
        <Link to={`/edit-template/${data.id}`} className="editButton">
          <span
            className="material-symbols-outlined"
            aria-label="edit template"
          >
            edit_square
          </span>
        </Link>
      )}

      <Link to={`/createlist/${data.id}`}>
        <h2>{data.name}</h2>{" "}
      </Link>
      <p className="creator">
        Creator: {data.user_name ? data.user_name : "Anonymous"}
      </p>

      {data.description && <p className="description">{data.description}</p>}

      <div>
        {tagNames.length > 0 && (
          <>
            <h4>Tags:</h4>
            <ul>
              {tagNames.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </>
        )}

        {checkAdminStatus() && (
          <>
            <br />
            <ButtonPrompt
              buttonName="Delete template"
              confirm={() => handleDelete(data.id)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Template;
