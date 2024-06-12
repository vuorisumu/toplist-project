import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { checkAdminStatus, clearAll, getTagNumbers, getUserId } from "./util";
import {
  enterTemplateEditMode,
  fetchTemplateById,
  fetchTagById,
  updateTemplate,
  deleteTemplate,
} from "./api";
import ButtonPrompt from "./ButtonPrompt";
import { formatData } from "../util/dataHandler";

/**
 * Edit template view that asks for the user to either be logged in as admin or to input
 * an edit key that is the optional password set for a template. When authorized, the user
 * can then edit the template or delete it completely
 * @returns the input field for edit key if not logged in, or the view where the template
 * can be edited
 */
function EditTemplate() {
  const [template, setTemplate] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [tags, setTags] = useState([""]);

  const location = useLocation();
  const navigate = useNavigate();
  const templateId = parseInt(location.pathname.replace("/edit-template/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  useEffect(() => {
    if (checkAdminStatus()) {
      fetchTemplate();
    }
  }, []);

  /**
   * Fetches the template from the database according to the template id
   * specified in the path name of this current view.
   */
  const fetchTemplate = async () => {
    await fetchTemplateById(templateId)
      .then((data) => {
        handleSetTemplate(formatData(data)[0]);
        setCanEdit(true);
      })
      .catch((err) => {
        setNotFound(true);
        console.log(err);
      });
  };

  /**
   * Handles unpacking the template data
   * @param {object} data - data object to be unpacked
   */
  const handleSetTemplate = (data) => {
    const tempData = data;
    const tempItems = data.items;
    tempData.items = tempItems;

    if (data.tags) {
      const tempTags = data.tags;
      tempData.tags = tempTags;
      fetchTagNames(tempData);
    }

    setTemplate(tempData);
  };

  /**
   * Fetches tag names from the database, using the tag ID numbers specified
   * in the template data
   * @param {object} tempData - template data containing tag IDs
   */
  const fetchTagNames = async (tempData) => {
    const fetchedNames = [];
    await Promise.all(
      tempData.tags.map(async (t) => {
        await fetchTagById(t)
          .then((data) => {
            fetchedNames.push(data[0].name);
          })
          .catch((err) => {
            console.log(err);
          });
      })
    );
    setTags(fetchedNames);
  };

  /**
   * Updates the name of a tag with the specified index
   * @param {string} newName - new name for the tag
   * @param {number} index - index of the tag in the tag container
   */
  const updateTagName = (newName, index) => {
    setTags((prev) => {
      const tempTags = [...prev];
      tempTags[index] = newName;
      return tempTags;
    });
  };

  /**
   * Deletes a tag from a specified index
   * @param {number} index - index of the tag
   */
  const deleteTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  /**
   * Adds a new tag field if the latest tag field is not empty
   * Does nothing if the newest tag field is empty
   */
  const addNewTagField = () => {
    const lastTag = tags[tags.length - 1];
    if (lastTag.trim() === "") {
      return;
    }
    setTags((prevTags) => {
      const tempTags = [...prevTags];
      tempTags.push("");
      return tempTags;
    });
  };

  /**
   * Updates the template name
   * @param {string} newName - new name for the template
   */
  const updateTemplateName = (newName) => {
    setTemplate((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  /**
   * Updates the template description
   * @param {string} newDesc - new description for the template
   */
  const updateDescription = (newDesc) => {
    setTemplate((prev) => ({
      ...prev,
      description: newDesc,
    }));
  };

  /**
   * Updates the template creator name
   * @param {string} newCreator - new creator name
   */
  const updateCreatorName = (newCreator) => {
    setTemplate((prev) => ({
      ...prev,
      user_name: newCreator,
    }));
  };

  /**
   * Updates the name of an item at a specified index
   * @param {string} newName - new item name
   * @param {number} index - index of the item to be renamed
   */
  const updateItemName = (newName, index) => {
    const newItems = template.items;
    newItems[index].item_name = newName;
    setTemplate((prevTemp) => ({
      ...prevTemp,
      items: newItems,
    }));
  };

  /**
   * Deletes an item from a specified index
   * @param {number} index - index of the item to be deleted
   */
  const deleteItem = (index) => {
    const newItems = template.items.filter((_, i) => i !== index);
    setTemplate((prevTemp) => ({
      ...prevTemp,
      items: newItems,
    }));
  };

  /**
   * Adds a new input field for items if the latest item is not empty
   * Does nothing if the last item is empty
   */
  const addNewField = () => {
    const lastItem = template.items[template.items.length - 1];
    if (lastItem.item_name.trim() === "") {
      return;
    }
    setTemplate((prevTemp) => ({
      ...prevTemp,
      items: [...prevTemp.items, { item_name: "" }],
    }));
  };

  /**
   * Packs the data and saves the changes to database
   */
  const saveChanges = async () => {
    // fetch tag numbers of non empty tags
    const nonEmptyTags = tags.filter((t) => t.trim() !== "");
    const tagNumbers = await getTagNumbers(nonEmptyTags);

    // only store non empty items
    const nonEmptyItems = template.items.filter(
      (t) => t.item_name.trim() !== ""
    );

    // build data
    const updatedData = {
      name: template.name,
      items: nonEmptyItems,
    };

    if (template.user_name) {
      // get the creator id
      const userNumber = await getUserId(template.user_name);
      updatedData.creator_id = userNumber;
    }

    if (tagNumbers.length > 0) {
      updatedData.tags = tagNumbers;
    }

    if (template.description) {
      updatedData.description = template.description;
    }

    // save changes to database
    updateTemplate(templateId, updatedData);
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
    return <p>{`Template doesn't exist or it has been deleted`}</p>;
  }

  if (!canEdit && !template) {
    return (
      <div className="container">
        <h1>Edit template</h1>
        <div className="no-stretch">
          <p>To edit this template, please login as admin</p>
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
        <div className="info">
          <label>Template name: </label>
          <input
            type="text"
            value={template.name}
            onChange={(e) => updateTemplateName(e.target.value)}
          />

          <label>Description: </label>
          <textarea
            value={template.description || ""}
            onChange={(e) => updateDescription(e.target.value)}
          />

          <label>Creator: </label>
          <input
            type="text"
            value={template.user_name}
            onChange={(e) => updateCreatorName(e.target.value)}
          />
        </div>

        <div className="addCont addItems">
          <h2>Items</h2>
          <ul>
            {template.items.map((i, index) => (
              <li key={"item" + index}>
                <input
                  type="text"
                  value={i.item_name}
                  onChange={(e) => updateItemName(e.target.value, index)}
                />
                <button
                  type="button"
                  onClick={() => deleteItem(index)}
                  className="deleteButton"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={addNewField} className="addButton">
                <span className="material-symbols-outlined">add</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="addCont addTags">
          <h2>Tags</h2>
          <ul>
            {tags.map((t, index) => (
              <li key={"tag" + index}>
                <input
                  type="text"
                  value={t}
                  onChange={(e) => updateTagName(e.target.value, index)}
                />
                <button
                  type="button"
                  onClick={() => deleteTag(index)}
                  className="deleteButton"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={addNewTagField}
                className="addButton"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </li>
          </ul>
        </div>

        <button type="button" onClick={saveChanges}>
          Save changes
        </button>
        <button type="button" onClick={clearAll}>
          Reset
        </button>

        <ButtonPrompt
          buttonName="Delete template"
          prompt="Are you sure?"
          confirm={handleDeleteTemplate}
        />
      </div>
    </div>
  );
}

EditTemplate.propTypes = {
  admin: PropTypes.bool.isRequired,
};

export default EditTemplate;
