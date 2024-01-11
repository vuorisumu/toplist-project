import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { clearAll, getTagNumbers, getUserId } from "./util";
import {
  enterTemplateEditMode,
  fetchTemplateById,
  fetchTagById,
  updateTemplate,
} from "./api";

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
          localStorage.setItem("edit" + templateId, true);
          handleSetTemplate(res.data[0]);
        } else {
          setEditKey("");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (props.auth || localStorage.getItem("edit" + templateId)) {
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

  // add new tag field
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
    console.log("Add");
  };

  // update template name
  const updateTemplateName = (newName) => {
    setTemplate((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  // update template description
  const updateDescription = (newDesc) => {
    setTemplate((prev) => ({
      ...prev,
      description: newDesc,
    }));
  };

  // update creator name
  const updateCreatorName = (newCreator) => {
    setTemplate((prev) => ({
      ...prev,
      user_name: newCreator,
    }));
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

  // save changes to template
  const saveChanges = async () => {
    // fetch tag numbers of non empty tags
    const nonEmptyTags = tags.filter((t) => t.trim() !== "");
    const tagNumbers = await getTagNumbers(nonEmptyTags);

    // get the creator id
    const userNumber = await getUserId(template.user_name);

    // only store non empty items
    const nonEmptyItems = template.items.filter(
      (t) => t.item_name.trim() !== ""
    );

    // build data
    const updatedData = {
      name: template.name,
      items: nonEmptyItems,
      creator_id: userNumber,
    };

    if (tagNumbers.length > 0) {
      updatedData.tags = tagNumbers;
    }

    if (template.description) {
      updatedData.description = template.description;
    }

    // save changes to database
    updateTemplate(templateId, updatedData);
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
        <input
          type="text"
          value={template.name}
          onChange={(e) => updateTemplateName(e.target.value)}
        />
        <br />
        <label>Description: </label>
        <textarea
          value={template.description || ""}
          onChange={(e) => updateDescription(e.target.value)}
        />
        <br />
        <label>Creator: </label>
        <input
          type="text"
          value={template.user_name}
          onChange={(e) => updateCreatorName(e.target.value)}
        />
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
          <li>
            <button type="button" onClick={addNewField}>
              Add item
            </button>
          </li>
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
          <li>
            <button type="button" onClick={addNewTagField}>
              Add tag
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

      <p>{JSON.stringify(template.items)}</p>
      <p>{tags}</p>
    </div>
  );
}

EditTemplate.propTypes = {
  auth: PropTypes.bool.isRequired,
};

export default EditTemplate;
