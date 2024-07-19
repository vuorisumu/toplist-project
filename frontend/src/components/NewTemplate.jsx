import { useEffect, useRef, useState } from "react";
import { clearAll } from "../util/misc";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../util/permissions";
import Dropdown from "./Dropdown";
import { getCategories } from "../util/storage";
import { addNewTemplate, testAddNewTemplate } from "../api/templates";
import { resizeImage } from "../util/imageHandler";

/**
 * View where the user can create a new template and add it to the database.
 * Renders a message asking the user to log in if the user hasn't logged in,
 * and renders the template creation view only if the user has logged in as either
 * admin or creator.
 *
 * @returns {JSX.Element} New template creation component
 */
function NewTemplate() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([""]);
  const [canCreate, setCanCreate] = useState(false);
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState(null);
  const [chosenCategory, setChosenCategory] = useState("");
  const [coverImage, setCoverImage] = useState({});
  const imgRef = useRef();

  useEffect(() => {
    if (isLoggedIn()) {
      setCanCreate(true);
      getCategories().then((data) => setCategories(data));
    } else {
      setCanCreate(false);
    }
  }, []);

  /**
   * Handles the selection of a cover image, resizing it if it is big.
   *
   * @param {ChangeEvent} e - event containing information about the current value
   */
  const handleImageSelected = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resized = await resizeImage(file);
      setCoverImage(resized);
    } else {
      console.log("no file");
    }
  };

  /**
   * Removes the chosen image.
   */
  const removeImage = () => {
    imgRef.current.value = "";
    setCoverImage({});
  };

  /**
   * Adds new item to the template, only if the latest item is not blank
   */
  const addItem = () => {
    if (items[items.length - 1].trim() !== "") {
      setItems([...items, ""]);
    }
  };

  /**
   * Renames an item of a specified index with a given value
   *
   * @param {number} index - index of the item to be edited
   * @param {string} value - new name of the item
   */
  const handleItemEdits = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
  };

  /**
   * Deletes an item from a specified index
   *
   * @param {number} index - index of the item to be deleted
   */
  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
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
    const hasName = templateName.trim() !== "";
    if (!hasName) {
      tempErrors.push("Template must have a name");
      document.getElementById("tempName").classList.add("error");
    } else {
      document.getElementById("tempName").classList.remove("error");
    }

    const enoughItems = items.filter((i) => i.trim() !== "").length >= 5;
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
   * Tries to add the template to the database. Does nothing if the minimum
   * requirements haven't been met. Otherwise builds the template data and
   * sends it to the database.
   */
  const createTemplate = async (e) => {
    e.preventDefault();
    if (!meetsRequirements()) {
      return;
    }

    const nonEnptyItems = items.filter((i) => i.trim() !== "");
    const itemObjects = [];
    nonEnptyItems.map((i) => {
      const newItem = {
        item_name: i,
      };
      itemObjects.push(newItem);
    });

    // mandatory data
    const templateData = {
      name: templateName,
      items: itemObjects,
      creator_id: localStorage.getItem("userId"),
    };

    // optional description
    if (description.trim() !== "") {
      templateData.description = description;
    }

    // cover image
    if (coverImage.name) {
      templateData.cover_image = coverImage;
    }

    // category
    if (chosenCategory !== "") {
      const categoryId = categories
        .filter((category) => category.name === chosenCategory)
        .map((category) => {
          return category.id;
        });
      templateData.category = categoryId[0];
    }

    // add template to database
    try {
      console.log(templateData);
      const res = await testAddNewTemplate(templateData);
      navigate(`/createlist/${res.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  if (!canCreate) {
    return (
      <div className="container">
        <div className="center">
          <p>Please login to create new template</p>
          <Login isFixed={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>New Template</h1>
      <div className="no-stretch newTemplate">
        <form encType="multipart/form-data" onSubmit={createTemplate}>
          <div className="info">
            <h2>Template info</h2>
            {coverImage.name && (
              <div id="imagePreview">
                <img src={URL.createObjectURL(coverImage)} />
                <button type="button" onClick={removeImage}>
                  Remove
                </button>
              </div>
            )}

            <label>Cover image:</label>
            <input
              type="file"
              ref={imgRef}
              id="coverImage"
              name="image"
              accept="image/png, image/gif, image/jpeg"
              onChange={handleImageSelected}
            />

            <label>Template name: </label>
            <input
              type="text"
              id="tempName"
              placeholder="New Template"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />

            <label>Template description: </label>
            <textarea
              placeholder="Description"
              style={{ width: "", height: "" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            {categories && (
              <Dropdown
                label={"Category"}
                placeholder={"Choose category"}
                items={categories.map((c) => c.name)}
                onSelect={setChosenCategory}
              />
            )}
          </div>

          <div className="addCont addItems">
            <h2>Template items</h2>
            <ul id="tempItems">
              {items.map((i, index) => (
                <li key={"item" + index}>
                  <input
                    type="text"
                    placeholder="List item"
                    value={i}
                    onChange={(e) => handleItemEdits(index, e.target.value)}
                  />
                  {index !== items.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => deleteItem(index)}
                      className="deleteButton"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={addItem}
                      className="addButton"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {errors.length > 0 && (
            <ul>
              {errors.map((err, index) => (
                <li key={"error" + index}>{err}</li>
              ))}
            </ul>
          )}

          <button type="submit" className="createButton">
            Create
          </button>

          <button type="button" onClick={clearAll} className="resetButton">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewTemplate;
