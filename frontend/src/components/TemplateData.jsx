import { useEffect, useRef, useState } from "react";
import { clearAll } from "../util/misc";
import Dropdown from "./Dropdown";
import { getCategories } from "../util/storage";
import { blobToFile, resizeImage } from "../util/imageHandler";
import { v4 as uuid } from "uuid";

function TemplateData({ data, onSubmit, submitText }) {
  const [templateName, setTemplateName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [items, setItems] = useState(data?.items || [{ item_name: "" }]);
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState(null);
  const [chosenCategory, setChosenCategory] = useState("Choose category");
  const [coverImage, setCoverImage] = useState({});
  const imgRef = useRef();

  useEffect(() => {
    getCategories().then((data) => setCategories(data));

    if (data && data.cover_image) {
      const img = blobToFile(data.cover_image);
      setCoverImage(img);
    }
  }, []);

  useEffect(() => {
    if (categories && data?.category) {
      const categoryName = categories
        .filter((category) => category.id === data.category)
        .map((category) => {
          return category.name;
        });
      setChosenCategory(categoryName[0]);
    }
  }, [categories]);

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

  const handleAddItemImage = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const resized = await resizeImage(file);
      const imgId = uuid();
      items[index].img_id = imgId;
      items[index].img = resized;
      console.log(items[index]);
      // setCoverImage(resized);
    } else {
      console.log("no file");
    }
  };

  /**
   * Adds new item to the template, only if the latest item is not blank
   */
  const addItem = () => {
    if (items[items.length - 1].item_name.trim() !== "") {
      setItems([...items, { item_name: "" }]);
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
    updatedItems[index].item_name = value;
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

    const enoughItems =
      items.filter((i) => i.item_name.trim() !== "").length >= 5;
    if (!enoughItems) {
      tempErrors.push("Template must have at least 5 items");
      document.getElementById("tempItems").classList.add("error");
    } else {
      document.getElementById("tempItems").classList.remove("error");
    }

    setErrors(tempErrors);
    return hasName && enoughItems;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetsRequirements()) {
      return;
    }

    const nonEmptyItems = items.filter((i) => i.item_name.trim() !== "");

    // mandatory data
    const templateData = {
      name: templateName,
      items: nonEmptyItems,
    };

    if (!data) {
      templateData.creator_id = localStorage.getItem("userId");
    }

    // optional description
    if (description.trim() !== "") {
      templateData.description = description;
    }

    // cover image
    if (coverImage.name) {
      templateData.cover_image = coverImage;
    } else {
      if (data && data.cover_image) {
        templateData.cover_image = "NULL";
      }
    }

    // category
    if (chosenCategory !== "" || chosenCategory !== "Choose category") {
      const categoryId = categories
        .filter((category) => category.name === chosenCategory)
        .map((category) => {
          return category.id;
        });
      templateData.category = categoryId[0];
    }

    onSubmit(templateData);
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="info">
        <h2>Template info</h2>
        {coverImage.name && (
          <div id="imagePreview">
            <img src={URL.createObjectURL(coverImage)} />
            <button type="button" onClick={removeImage}>
              X
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
            placeholder={chosenCategory}
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
                value={i.item_name}
                onChange={(e) => handleItemEdits(index, e.target.value)}
              />
              <input
                type="file"
                id={`item${index}`}
                name={`item${index}`}
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => handleAddItemImage(e, index)}
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
                <button type="button" onClick={addItem} className="addButton">
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
        {submitText}
      </button>

      <button type="button" onClick={clearAll} className="resetButton">
        Reset
      </button>
    </form>
  );
}

export default TemplateData;
