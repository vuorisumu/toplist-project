import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { clearAll } from "../util/misc";
import ButtonPrompt from "./ButtonPrompt";
import { formatData } from "../util/dataHandler";
import { isCreatorOfTemplate } from "../util/permissions";
import { getCategories } from "../util/storage";
import { fetchTemplateById } from "../api/templates";
import { updateTemplate, deleteTemplate } from "../api/templates";
import TemplateData from "./TemplateData";

/**
 * Edit template view that asks for the user to either be logged in as admin or to input
 * an edit key that is the optional password set for a template. When authorized, the user
 * can then edit the template or delete it completely
 *
 * @returns {JSX.Element} the input field for edit key if not logged in, or the view where the template
 * can be edited
 */
function EditTemplate() {
  const [template, setTemplate] = useState(null);
  const categories = useRef([]);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const templateId = parseInt(location.pathname.replace("/edit-template/", ""));

  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (canEdit) {
      fetchTemplate();
    }
  }, [canEdit]);

  /**
   * Checks if the user is logged in as admin or is the creator of the
   * currently chosen template.
   */
  const checkPermission = async () => {
    try {
      const isCreator = await isCreatorOfTemplate(templateId);
      setCanEdit(isCreator);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Fetches the template from the database according to the template id
   * specified in the path name of this current view.
   */
  const fetchTemplate = async () => {
    await getCategories()
      .then((data) => (categories.current = data))
      .catch((err) => console.log(err));

    await fetchTemplateById(templateId)
      .then((data) => {
        const formattedData = formatData(data);
        if (formattedData.length > 0) {
          handleSetTemplate(formattedData[0]);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setNotFound(true);
        console.log(err);
      });
  };

  /**
   * Handles unpacking the template data
   *
   * @param {object} data - data object to be unpacked
   */
  const handleSetTemplate = (data) => {
    const tempData = data;
    const tempItems = data.items;
    tempData.items = tempItems;
    setTemplate(tempData);
  };

  /**
   * Packs the data and saves the changes to database
   */
  const saveChanges = async (updatedData) => {
    // save changes to database
    setCreating(true);
    await updateTemplate(templateId, updatedData);
    setCreating(false);
    navigate(`/createlist/${templateId}`);
  };

  /**
   * Deletes the template and refreshes the page
   */
  const handleDeleteTemplate = () => {
    deleteTemplate(templateId)
      .then((res) => {
        clearAll();
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  if (notFound) {
    return (
      <div className="container">
        <h1>Not found</h1>
        <p>{`Template doesn't exist or it has been deleted`}</p>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="container">
        <h1>Edit template</h1>
        <div className="no-stretch">
          <p>You don't have a permission to edit this template</p>
          <br />
          <button onClick={() => navigate(-1)} className="backButton">
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!template || loading) {
    return (
      <div className="container">
        <h1>Edit template</h1>
        <div className="no-stretch">
          <p>Loading...</p>
          <br />
          <button onClick={() => navigate(-1)} className="backButton">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Edit template</h1>
      <div className="no-stretch">
        <TemplateData
          data={template}
          onSubmit={saveChanges}
          submitText="Save changes"
          creating={creating}
        />

        <ButtonPrompt
          buttonName="Delete template"
          prompt="Are you sure?"
          confirm={handleDeleteTemplate}
        />
      </div>
    </div>
  );
}

export default EditTemplate;
