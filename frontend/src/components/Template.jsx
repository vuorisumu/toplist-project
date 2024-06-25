import { Link } from "react-router-dom";
import { deleteTemplate } from "./api";
import { checkAdminStatus } from "./util";
import ButtonPrompt from "./ButtonPrompt";

function Template(props) {
  const data = props.data;

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

      {checkAdminStatus() && (
        <div>
          <br />
          <ButtonPrompt
            buttonName="Delete template"
            confirm={() => handleDelete(data.id)}
          />
        </div>
      )}
    </>
  );
}

export default Template;
