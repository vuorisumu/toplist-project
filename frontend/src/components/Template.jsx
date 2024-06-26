import { Link } from "react-router-dom";
import { deleteTemplate } from "./api";
import ButtonPrompt from "./ButtonPrompt";
import { isAdmin, isCreatorOfTemplate } from "../util/permissions";
import { useEffect, useState } from "react";

/**
 * Reusable component displaying a preview of a template
 *
 * @param {object} props.data - The data of the template
 * @returns {JSX.Element} Template preview component
 */
function Template({ data }) {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  /**
   * Checks if the user is logged in as admin or is the creator of the
   * currently chosen template.
   */
  const checkPermission = async () => {
    try {
      const isCreator = await isCreatorOfTemplate(data.id);
      setCanEdit(isCreator);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Deletes the chosen template from the database and refreshes
   */
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
      {canEdit && (
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

      {isAdmin() && (
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
