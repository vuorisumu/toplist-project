import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAdminStatus } from "./util";
import { enterTemplateEditMode, fetchTemplateById } from "./api";

function EditTemplate() {
  const [editKey, setEditKey] = useState("");
  const [template, setTemplate] = useState(null);

  const location = useLocation();
  const templateId = parseInt(location.pathname.replace("/edit-template/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  const checkEditKey = async () => {
    await enterTemplateEditMode(templateId, editKey)
      .then((res) => {
        if (res.data) {
          setTemplate(res.data);
        } else {
          setEditKey("");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (checkAdminStatus()) {
      fetchTemplateById(templateId)
        .then((data) => {
          const templateData = data[0];
          const templateItems = JSON.parse(data[0].items);
          templateData.items = templateItems;

          if (data[0].tags) {
            const templateTags = JSON.parse(data[0].tags);
            templateData.tags = templateTags;
          }

          setTemplate(templateData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

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
        <ul></ul>
      </div>

      <p>{JSON.stringify(template.items)}</p>
    </div>
  );
}

export default EditTemplate;
