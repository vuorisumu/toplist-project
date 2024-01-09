import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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

  const checkEditKey = async () => {
    const res = await enterTemplateEditMode(templateId, editKey);

    if (res.data) {
      // correct edit key
      setTemplate(res.data[0]);
    } else {
      // incorrect edit key
      setEditKey("");
    }
  };

  useEffect(() => {
    console.log(template);
  }, [template]);

  if (!checkAdminStatus()) {
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
    </div>
  );
}

export default EditTemplate;
