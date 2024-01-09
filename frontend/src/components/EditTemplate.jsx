import { useLocation } from "react-router-dom";
import { useState } from "react";
import { checkAdminStatus } from "./util";
import { enterTemplateEditMode } from "./api";

function EditTemplate() {
  const [editKey, setEditKey] = useState("");
  const [template, setTemplate] = useState(null);

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

  // set template data
  const handleSetTemplate = (data) => {
    const tempData = data;
    const tempItems = JSON.parse(data.items);
    tempData.items = tempItems;

    if (data.tags) {
      const tempTags = JSON.parse(data.tags);
      tempData.tags = tempTags;
    }

    setTemplate(tempData);
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

  if (!checkAdminStatus() && !template) {
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

      <p>{JSON.stringify(template.items)}</p>
    </div>
  );
}

export default EditTemplate;
