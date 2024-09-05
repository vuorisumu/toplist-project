import { useContext, useEffect, useRef, useState } from "react";
import { clearAll } from "../util/misc";
import Dropdown from "./Dropdown";
import { getCategories } from "../util/storage";
import { blobToFile, getItemImages, resizeImage } from "../util/imageHandler";
import { v4 as uuid } from "uuid";
import { addNewImages } from "../api/images";
import UserContext from "../util/UserContext";

function TemplateData({ data, onSubmit, submitText, creating }) {
  const [templateName, setTemplateName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [items, setItems] = useState(data?.items || [{ item_name: "" }]);
  const [itemImages, setItemImages] = useState([]);
  const [hasImages, setHasImages] = useState(false);
  const [isBlank, setIsBlank] = useState(false);
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState(null);
  const [chosenCategory, setChosenCategory] = useState("Choose category");
  const [coverImage, setCoverImage] = useState({});
  const [loading, setLoading] = useState(true);
  const imgRef = useRef();
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Gets the category list from the database
    getCategories().then((data) => setCategories(data));

    // Sets the existing data when in edit mode
    if (data) {
      // Cover image
      if (data.cover_image) {
        const img = blobToFile(data.cover_image);
        setCoverImage(img);
      }

      // List has existing images
      if (data.items[0].img_id) {
        setHasImages(true);
        const imageIds = [];
        data.items.map((i) => {
          imageIds.push(i.img_id);
        });
        getImages(imageIds);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Sets the chosen category after categories are loaded from the database
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
   * Gets all images with the given IDs from the database and set them to state.
   *
   * @param {Array} imageIds - Array of image IDs
   */
  const getImages = async (imageIds) => {
    const fetchedImages = await getItemImages(imageIds);
    setItemImages(fetchedImages);
    setLoading(false);
  };

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
      removeImage();
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
   * Adds an image to an item with the given index
   *
   * @param {ChangeEvent} e - event containing information about the current value
   * @param {number} index - Item index to which the image is added
   */
  const handleAddItemImage = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const resized = await resizeImage(file, {
        maxWidth: 150,
        maxHeight: 150,
      });
      const imgId = uuid();
      items[index].img_id = imgId;
      items[index].img = resized;
      setItemImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = resized;
        return newImages;
      });
    } else {
      setItemImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = {};
        return newImages;
      });
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

    // check template name
    const hasName = templateName.trim() !== "";
    if (!hasName) {
      tempErrors.push("Template must have a name");
      document.getElementById("tempName").classList.add("error");
    } else {
      document.getElementById("tempName").classList.remove("error");
    }

    // check item count
    const enoughItems =
      isBlank || items.filter((i) => i.item_name.trim() !== "").length >= 5;

    if (!enoughItems) {
      tempErrors.push("Non-blank templates must have at least 5 items");
    }

    // check correct amount of images
    const imagesOkay =
      !isBlank && hasImages
        ? itemImages.length ===
          items.filter((i) => i.item_name.trim() !== "").length
        : true;

    if (!imagesOkay) {
      tempErrors.push(
        "All items must have an image when making a template with images"
      );
    }

    if (!enoughItems || !imagesOkay) {
      document.getElementById("tempItems")?.classList.add("error");
    } else {
      document.getElementById("tempItems")?.classList.remove("error");
    }

    setErrors(tempErrors);
    return hasName && enoughItems && imagesOkay;
  };

  /**
   * Handles submitting the newly created template.
   * Doesn't do anything if the template doesn't meet the minimum requirements.
   *
   * @param {Event} e - event information
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!meetsRequirements()) {
      return;
    }

    setLoading(true);

    // mandatory data
    const templateData = {
      name: templateName,
    };

    // create image array
    const addedImages =
      hasImages && !isBlank
        ? items
            .filter((i) => i.item_name.trim() !== "" && i.img)
            .map((i) => ({
              id: i.img_id,
              img: i.img,
            }))
        : [];

    if (isBlank) {
      // placeholder item
      templateData.items = [{ item_name: "" }];
    } else {
      // create item array with relevant information
      const filteredItems = items.filter((i) => i.item_name.trim() !== "");
      const nonEmptyItems = filteredItems.map((i) => ({
        item_name: i.item_name,
        ...(hasImages && { img_id: i.img_id }),
      }));

      templateData.items = nonEmptyItems;
    }

    // add creator id when creating a new template
    if (!data) {
      templateData.creator_id = user.id;
    }

    // template settings
    const settings = {
      hasImages: hasImages,
      isBlank: isBlank,
    };
    templateData.settings = settings;

    // set images to false on blank lists
    if (isBlank) {
      templateData.settings.hasImages = false;
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

    // add images to database
    if (addedImages.length > 0) {
      const res = await addNewImages(addedImages);
    }

    setLoading(false);
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
        <label className="fileInput">
          <input
            type="file"
            ref={imgRef}
            id="coverImage"
            name="image"
            accept="image/png, image/gif, image/jpeg"
            onChange={handleImageSelected}
          />
        </label>

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
        <div>
          {/* Toggle for blank template */}
          <label>Make a blank template: </label>
          <div className="toggle">
            <input
              type="checkbox"
              name="toggleBlank"
              id="toggleBlank"
              checked={isBlank}
              onChange={() => setIsBlank(!isBlank)}
            />
            <label htmlFor="toggleBlank"></label>
          </div>
        </div>

        {isBlank ? (
          <div>
            <p>Blank template means that everyone will add their own items.</p>
          </div>
        ) : (
          <>
            <div>
              <label>Add images: </label>
              <div className="toggle">
                <input
                  type="checkbox"
                  name="toggleImages"
                  id="toggleImages"
                  checked={hasImages}
                  onChange={() => setHasImages(!hasImages)}
                />
                <label htmlFor="toggleImages"></label>
              </div>
            </div>

            <ul id="tempItems">
              {items.map((i, index) => (
                <li key={"item" + index}>
                  {hasImages === true && (
                    <>
                      <div className="itemImage">
                        {itemImages[index]?.name ? (
                          <img src={URL.createObjectURL(itemImages[index])} />
                        ) : itemImages[index]?.img_url ? (
                          <img src={itemImages[index].img_url} />
                        ) : loading ? (
                          <span className="material-symbols-outlined imagePlaceholder">
                            pending
                          </span>
                        ) : (
                          <span className="material-symbols-outlined imagePlaceholder">
                            image
                          </span>
                        )}
                      </div>
                      <label className="fileInput">
                        <input
                          type="file"
                          id={`item${index}`}
                          name={`item${index}`}
                          accept="image/png, image/gif, image/jpeg"
                          onChange={(e) => handleAddItemImage(e, index)}
                        />
                      </label>
                    </>
                  )}
                  <input
                    type="text"
                    placeholder="List item"
                    value={i.item_name}
                    onChange={(e) => handleItemEdits(index, e.target.value)}
                  />

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteItem(index)}
                      className="deleteButton"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </li>
              ))}
              <button type="button" onClick={addItem} className="addButton">
                <span className="material-symbols-outlined">add</span>
              </button>
            </ul>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <ul>
          {errors.map((err, index) => (
            <li key={"error" + index}>{err}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className={`createButton ${loading || creating ? "disabled" : ""}`}
        disabled={loading}
      >
        {loading ? "Loading" : submitText}
      </button>

      <button type="button" onClick={clearAll} className="resetButton">
        Reset
      </button>
    </form>
  );
}

export default TemplateData;
