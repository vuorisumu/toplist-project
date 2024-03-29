import { useEffect, useState } from "react";
import { clearAll, getTagNumbers, getUserId, checkCreatorStatus } from "./util";
import { addNewTemplate, fetchAllTags } from "./api";
import SearchInput from "./SearchInput";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

/**
 * View where the user can create a new template and add it to the database.
 * Renders a message asking the user to log in if the user hasn't logged in,
 * and renders the template creation view only if the user has logged in as either
 * admin or creator.
 */
function NewTemplate() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [items, setItems] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [suggestions, setSuggestions] = useState([""]);
  const [editKey, setEditKey] = useState("");
  const [canCreate, setCanCreate] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (checkCreatorStatus()) {
      setCanCreate(true);
      fetchAllTags()
        .then((data) => {
          const tagNames = data.map((tag) => tag.name);
          setSuggestions(tagNames);
        })
        .catch((err) => console.log(err));
    } else {
      setCanCreate(false);
    }
  }, [suggestions.length]);

  /**
   * Adds new item to the template, only if the latest item is not blank
   */
  const addItem = () => {
    if (items[items.length - 1].trim() !== "") {
      setItems([...items, ""]);
    }
  };

  /**
   * Adds a new tag to the template, only if the latest tag is not blank
   */
  const addTag = () => {
    if (tags[tags.length - 1].trim() !== "") {
      setTags([...tags, ""]);
    }
  };

  /**
   * Renames an item of a specified index with a given value
   * @param {number} index - index of the item to be edited
   * @param {string} value - new name of the item
   */
  const handleItemEdits = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
  };

  /**
   * Renames a tag of a specified index with a given value
   * @param {number} index - index of the tag to be edited
   * @param {string} value - new name of the tag
   */
  const handleTagEdits = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };

  /**
   * Deletes an item from a specified index
   * @param {number} index - index of the item to be deleted
   */
  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  /**
   * Deletes a tag from a specified index
   * @param {number} index - index of the tag to be deleted
   */
  const deleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  /**
   * Checks if the created template meets the minimum requirements
   * for saving to the database
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
  const createTemplate = async () => {
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
    };

    // optional tags
    const nonEmptyTags = tags.filter((t) => t.trim() !== "");
    if (nonEmptyTags.length > 0) {
      // convert text tags to numbers
      const tagNumbers = await getTagNumbers(nonEmptyTags);
      templateData.tags = tagNumbers;
    }

    // optional creator info
    if (creatorName !== "") {
      templateData.creator_id = await getUserId(creatorName);
    }

    // optional description
    if (description.trim() !== "") {
      templateData.description = description;
    }

    // optional editkey
    if (editKey.trim() !== "") {
      templateData.editkey = editKey;
    }

    // add template to database
    try {
      const res = await addNewTemplate(templateData);
      navigate(`/createranking/${res.id}`);
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
      <div className="no-stretch">
        <div className="info">
          <h2>Template info</h2>
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

          <label>Creator name: </label>
          <input
            type="text"
            placeholder="Creator"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
          />
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
                  <button type="button" onClick={addItem} className="addButton">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="addCont addTags">
          <h2>Tags</h2>
          <ul>
            {tags.map((i, index) => (
              <li key={"tag" + index}>
                <SearchInput
                  initValue={i}
                  placeholder={"Tag name"}
                  suggestionData={suggestions}
                  onChange={(val) => handleTagEdits(index, val)}
                  onSelected={(val) => handleTagEdits(index, val)}
                />
                {index !== tags.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => deleteTag(index)}
                    className="deleteButton"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                ) : (
                  <button type="button" onClick={addTag} className="addButton">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="inputField editkeyField">
          <label>Edit key: </label>
          <input
            type="text"
            placeholder="Edit key"
            value={editKey}
            onChange={(e) => setEditKey(e.target.value)}
          />
          <p className="smallPrint">
            Edit key is used as a password for this template, so keep your edit
            key safe if you wish to edit the template in the future
          </p>
        </div>

        {errors.length > 0 && (
          <ul>
            {errors.map((err, index) => (
              <li key={"error" + index}>{err}</li>
            ))}
          </ul>
        )}

        <button type="button" onClick={createTemplate} className="createButton">
          Create
        </button>
        <button type="button" onClick={clearAll} className="resetButton">
          Reset
        </button>
      </div>
    </div>
  );
}

export default NewTemplate;
