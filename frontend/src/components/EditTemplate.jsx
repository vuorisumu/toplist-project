import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { clearAll } from "../util/misc";
import ButtonPrompt from "./ButtonPrompt";
import { formatData } from "../util/dataHandler";
import { isCreatorOfTemplate } from "../util/permissions";
import { getCategories } from "../util/storage";
import Dropdown from "./Dropdown";
import { fetchTemplateById } from "../api/templates";
import { updateTemplate, deleteTemplate } from "../api/templates";

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
  // const [categories, setCategories] = useState(null);
  const [chosenCategory, setChosenCategory] = useState("Uncategorized");
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errors, setErrors] = useState([]);
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
        handleSetTemplate(formattedData[0]);
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
    if (data.category) {
      const categoryName = categories.current
        .filter((category) => category.id === data.category)
        .map((category) => {
          return category.name;
        });
      setChosenCategory(categoryName[0]);
    }

    setTemplate(tempData);
  };

  /**
   * Updates the template name
   *
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
   *
   * @param {string} newDesc - new description for the template
   */
  const updateDescription = (newDesc) => {
    setTemplate((prev) => ({
      ...prev,
      description: newDesc,
    }));
  };

  /**
   * Updates the name of an item at a specified index
   *
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
   *
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
   * Updates the category of the template.
   *
   * @param {string} newCategory - Chosen category
   */
  const updateCategory = (newCategory) => {
    const newCategoryId = categories.current
      .filter((category) => category.name === newCategory)
      .map((category) => {
        return category.id;
      });
    setTemplate((prevTemp) => ({
      ...prevTemp,
      category: newCategoryId[0],
    }));
  };

  /**
   * Checks if the created template meets the minimum requirements
   * for saving to the database
   *
   * @returns true if requirements have been met, false if the name field
   * is empty or if the template has less than five items
   */
  const meetsRequirements = () => {
    const tempErrors = [];
    const hasName = template.name.trim() !== "";
    if (!hasName) {
      tempErrors.push("Template must have a name");
      document.getElementById("tempName").classList.add("error");
    } else {
      document.getElementById("tempName").classList.remove("error");
    }

    const enoughItems =
      template.items.filter((i) => i.item_name.trim() !== "").length >= 5;
    if (!enoughItems) {
      tempErrors.push("Template must have at least 5 items");
      document.getElementById("tempItems").classList.add("error");
    } else {
      document.getElementById("tempItems").classList.remove("error");
    }

    setErrors(tempErrors);
    return hasName && enoughItems;
  };

  /**
   * Packs the data and saves the changes to database
   */
  const saveChanges = async () => {
    if (!meetsRequirements()) {
      return;
    }

    // only store non empty items
    const nonEmptyItems = template.items.filter(
      (t) => t.item_name.trim() !== ""
    );

    // build data
    const updatedData = {
      name: template.name,
      items: nonEmptyItems,
    };

    if (template.description) {
      updatedData.description = template.description;
    } else {
      updatedData.description = "";
    }

    if (template.category) {
      updatedData.category = template.category;
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
        <div className="info">
          <label>Template name: </label>
          <input
            type="text"
            id="tempName"
            value={template.name}
            onChange={(e) => updateTemplateName(e.target.value)}
          />

          <label>Description: </label>
          <textarea
            value={template.description || ""}
            onChange={(e) => updateDescription(e.target.value)}
          />
        </div>

        <div>
          {categories.current && (
            <Dropdown
              label={"Category"}
              placeholder={chosenCategory}
              items={categories.current.map((c) => c.name)}
              onSelect={updateCategory}
            />
          )}
        </div>

        <div className="addCont addItems">
          <h2>Items</h2>
          <ul id="tempItems">
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

        {errors.length > 0 && (
          <ul>
            {errors.map((err, index) => (
              <li key={"error" + index}>{err}</li>
            ))}
          </ul>
        )}

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

export default EditTemplate;
