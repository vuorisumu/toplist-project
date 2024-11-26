import { useEffect, useState } from "react";

function SaveList({
  template,
  setCopyTemplate,
  setNewTempName,
  setNewTempDesc,
}) {
  const [copy, setCopy] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => setCopyTemplate(copy), [copy]);
  useEffect(() => setNewTempName(name), [name]);
  useEffect(() => setNewTempDesc(desc), [desc]);

  return (
    <div>
      <div>
        <label>Save as new template: </label>
        <div className="toggle">
          <input
            type="checkbox"
            name="toggleNewTemplate"
            id="toggleNewTemplate"
            className="menu"
            checked={copy}
            onChange={() => setCopy(!copy)}
          />
          <label htmlFor="toggleNewTemplate"></label>
        </div>
      </div>

      {copy && (
        <>
          <p>
            Makes a copy of the original template and saves it with your
            additions.
          </p>
          <div className="rankInfo">
            <label>New template name:</label>
            <input
              type="text"
              id="newTemplateName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={template.name}
            />

            <label>New template description: </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={template.description}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SaveList;
