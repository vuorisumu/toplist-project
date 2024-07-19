import { Link } from "react-router-dom";
import ButtonPrompt from "./ButtonPrompt";
import { isAdmin, isCreatorOfTemplate } from "../util/permissions";
import { useEffect, useState } from "react";
import { getCategoryById } from "../util/storage";
import { deleteTemplate } from "../api/templates";
import { Buffer } from "buffer";

/**
 * Reusable component displaying a preview of a template
 *
 * @param {object} props.data - The data of the template
 * @param {boolean} props.showCreator - Whether to display creator name,
 * true by default
 * @returns {JSX.Element} Template preview component
 */
function Template({ data, showCreator = true }) {
  const [canEdit, setCanEdit] = useState(false);
  const [category, setCategory] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    checkPermission();
    getCategoryById(data.category)
      .then((c) => setCategory(c))
      .catch((err) => console.log(err));

    if (data.cover_image) {
      const base64Image = Buffer.from(data.cover_image.data).toString("base64");
      setImgUrl(`data:image/png;base64,${base64Image}`);
      // console.log(imgUrl);
    }
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

      {data.cover_image && (
        <div className="coverImage">
          <img src={imgUrl} />
        </div>
      )}

      <p>Category: {category}</p>
      {showCreator && (
        <p className="creator">
          Creator:{" "}
          {data.user_name ? (
            <Link to={`/user/${data.user_name}`}>{data.user_name}</Link>
          ) : (
            "Anonymous"
          )}
        </p>
      )}

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
