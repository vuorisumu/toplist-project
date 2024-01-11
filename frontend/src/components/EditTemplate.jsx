import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { enterTemplateEditMode, fetchTemplateById, fetchTagById } from "./api";

function EditTemplate(props) {
  const [editKey, setEditKey] = useState("");
  const [template, setTemplate] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tags, setTags] = useState([""]);

  const location = useLocation();
  const templateId = parseInt(location.pathname.replace("/edit-template/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  // authentication
  const checkEditKey = async () => {
    await enterTemplateEditMode(templateId, editKey)
      .then((res) => {
        if (res.data) {
          handleSetTemplate(res.data[0]);
        } else {
          setEditKey("");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (props.auth) {
      fetchTemplate();
    }
  }, [props.auth]);

  const fetchTemplate = async () => {
    await fetchTemplateById(templateId)
      .then((data) => {
        handleSetTemplate(data[0]);
        setIsAdmin(true);
      })
      .catch((err) => console.log(err));
  };

  // set template data
  const handleSetTemplate = (data) => {
    const tempData = data;
    const tempItems = JSON.parse(data.items);
    tempData.items = tempItems;

    if (data.tags) {
      const tempTags = JSON.parse(data.tags);
      tempData.tags = tempTags;
      fetchTagNames(tempData);
    }

    setTemplate(tempData);
  };

  // fetch and set all tag names
  const fetchTagNames = async (tempData) => {
    console.log("called");
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

  // update tag names
  const updateTagName = (newName, index) => {
    setTags((prev) => {
      const tempTags = [...prev];
      tempTags[index] = newName;
      return tempTags;
    });
  };

  // delete tag from index
  const deleteTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  // update item names
  const updateItemName = (newName, index) => {
    const newItems = template.items;
    newItems[index].item_name = newName;
    setTemplate((prevTemp) => ({
      ...prevTemp,
      items: newItems,
    }));
  };

  // delete item from index
  const deleteItem = (index) => {
    const newItems = template.items.filter((_, i) => i !== index);
    setTemplate((prevTemp) => ({
      ...prevTemp,
      items: newItems,
    }));
  };

  // add new input field for items
  const addNewField = () => {
    const lastItem = template.items[template.items.length - 1];
    if (lastItem.item_name.trim() === "") {
      return;
    }
    setTemplate((prevTemp) => ({
      ...prevTemp,
      items: [...prevTemp.items, { item_name: "" }],
    }));
    console.log("Add");
  };

  if (!isAdmin && !template) {
    return (
      <div>
        <p>Not admin</p>
        <label>Edit key: </label>
        <input
          type="password"
          placeholder="Edit key"
          value={editKey}
          onChange={(e) => setEditKey(e.target.value)}
        />
        <br />
        <button type="button" onClick={checkEditKey}>
          Enter
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit template</h1>

      <div>
        <label>Template name: </label>
        <input type="text" />
        <br />
        <label>Description: </label>
        <textarea />
        <br />
        <label>Creator: </label>
        <input type="text" />
      </div>

      <div>
        <h2>Items</h2>
        <ul>
          {template.items.map((i, index) => (
            <li key={"item" + index}>
              <input
                type="text"
                value={i.item_name}
                onChange={(e) => updateItemName(e.target.value, index)}
              />
              <button type="button" onClick={() => deleteItem(index)}>
                x
              </button>
            </li>
          ))}
          <button type="button" onClick={addNewField}>
            Add item
          </button>
        </ul>
      </div>

      <div>
        <h2>Tags</h2>
        <ul>
          {tags.map((t, index) => (
            <li key={"tag" + index}>
              <input
                type="text"
                value={t}
                onChange={(e) => updateTagName(e.target.value, index)}
              />
              <button type="button" onClick={() => deleteTag(index)}>
                x
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p>{JSON.stringify(template.items)}</p>
      <p>{tags}</p>
    </div>
  );
}

EditTemplate.propTypes = {
  auth: PropTypes.bool.isRequired,
};

export default EditTemplate;
