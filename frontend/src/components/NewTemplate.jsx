import { useState } from "react";
import { clearAll } from "./util";
import { fetchUserByName, addNewUser } from "./api";

function NewTemplate() {
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [items, setItems] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [editKey, setEditKey] = useState("");

  // add new item
  const addItem = () => {
    if (items[items.length - 1].trim() !== "") {
      setItems([...items, ""]);
    }
  };

  // add new tag
  const addTag = () => {
    if (tags[tags.length - 1].trim() !== "") {
      setTags([...tags, ""]);
    }
  };

  // edit an item
  const handleItemEdits = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
  };

  // edit a tag
  const handleTagEdits = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };

  // delete item from index
  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // delete tag from index
  const deleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  // checks if template meets the minimum requirements
  const meetsRequirements = () => {
    const hasName = templateName !== "";
    let enoughItems = items.length > 5;
    if (items.length === 5) {
      enoughItems = items[items.length - 1] !== "";
    }
    return hasName && enoughItems;
  };

  // creates template and adds it to database
  const createTemplate = async () => {
    if (!meetsRequirements()) {
      return;
    }

    console.log("Creating template");
    // mandatory data
    const templateData = {
      name: templateName,
      items: items,
    };

    // optional creator info
    if (creatorName !== "") {
      const fetchedUser = await fetchUserByName(creatorName.trim());
      if (fetchedUser.length > 0) {
        templateData.creator_id = fetchedUser[0].user_id;
      } else {
        // add new user here
        const newUser = {
          user_name: creatorName,
        };

        const newUserResponse = await addNewUser(newUser);
        templateData.creator_id = newUserResponse[0].user_id;
      }
    }

    // optional description
    if (description !== "") {
      templateData.description = description;
    }

    // optional editkey
    if (editKey !== "") {
      templateData.editKey = editKey;
    }
  };

  return (
    <>
      <h1>New Template</h1>
      <div>
        <h2>Template info</h2>
        <label>Template name: </label>
        <input
          type="text"
          placeholder="New Template"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <br />
        <label>Template description: </label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <label>Creator name: </label>
        <input
          type="text"
          placeholder="Creator"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
        />
      </div>

      <div>
        <h2>Template items</h2>
        <ul>
          {items.map((i, index) => (
            <li key={"item" + index}>
              <input
                type="text"
                placeholder="List item"
                value={i}
                onChange={(e) => handleItemEdits(index, e.target.value)}
              />
              {index !== items.length - 1 ? (
                <button type="button" onClick={() => deleteItem(index)}>
                  Delete
                </button>
              ) : (
                <button type="button" onClick={addItem}>
                  Add
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Tags</h2>
        <ul>
          {tags.map((i, index) => (
            <li key={"tag" + index}>
              <input
                type="text"
                placeholder="Tag"
                value={i}
                onChange={(e) => handleTagEdits(index, e.target.value)}
              />
              {index !== tags.length - 1 ? (
                <button type="button" onClick={() => deleteTag(index)}>
                  Delete
                </button>
              ) : (
                <button type="button" onClick={addTag}>
                  Add
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label>Edit key: </label>
        <input
          type="text"
          placeholder="Edit key"
          value={editKey}
          onChange={(e) => setEditKey(e.target.value)}
        />
      </div>

      <button type="button" onClick={createTemplate}>
        Create
      </button>
      <button type="button" onClick={clearAll}>
        Reset
      </button>
    </>
  );
}

export default NewTemplate;
