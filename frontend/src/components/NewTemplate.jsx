import { useState } from "react";
import { clearAll, getTagNumbers, getUserId } from "./util";
import { addNewTemplate } from "./api";
import TagInput from "./TagInput";

function NewTemplate() {
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [items, setItems] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [editKey, setEditKey] = useState("");

  const suggestions = ["Testi", "Aa", "Bee", "Cee"];

  const printTags = () => {
    tags.map((t) => {
      console.log(t);
    });
  };

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
    const hasName = templateName.trim() !== "";
    const enoughItems = items.filter((i) => i.trim() !== "").length >= 5;
    return hasName && enoughItems;
  };

  // creates template and adds it to database
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
      const addedTemplate = await addNewTemplate(templateData);
      console.log("Added: ", addedTemplate);
    } catch (err) {
      console.log(err);
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
              <TagInput
                initValue={i}
                suggestionData={suggestions}
                onChange={(val) => handleTagEdits(index, val)}
                onSelected={(val) => handleTagEdits(index, val)}
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

        <button type="button" onClick={printTags}>
          Test tags
        </button>
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
