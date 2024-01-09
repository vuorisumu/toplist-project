import { useLocation } from "react-router-dom";
import { useState } from "react";
import { checkAdminStatus } from "./util";

function EditTemplate() {
  const [editKey, setEditKey] = useState("");

  const location = useLocation();
  const templateId = parseInt(location.pathname.replace("/edit-template/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  const checkEditKey = async () => {
    console.log("Checking edit key");
  };

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
