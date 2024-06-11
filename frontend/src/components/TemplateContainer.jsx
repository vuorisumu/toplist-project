import { useState, useEffect } from "react";
import { fetchAllTemplatesFiltered, fetchTemplateCount } from "./api";
import { formatData, getCountFromData } from "../util/dataHandler";
import Template from "./Template";

function TemplateContainer() {
  const [templates, setTemplates] = useState([]);
  const defaultQuery = "sortBy=id&sortOrder=desc";
  const [templateCount, setTemplateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplateCount();
    fetchRecent();
  }, []);

  const getTemplateCount = async () => {
    fetchTemplateCount()
      .then((data) => {
        setTemplateCount(getCountFromData(data));
      })
      .catch((err) => console.log(err));
  };

  async function fetchRecent() {
    fetchAllTemplatesFiltered(`${defaultQuery}`)
      .then((data) => {
        setTemplates(formatData(data));
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div>
        <h2>Recent templates</h2>
        {!loading && templates.length < 1 && <p>No templates found</p>}
        {loading ? (
          <p>Loading</p>
        ) : (
          <ul className="lists">
            {templates.map((template) => (
              <li key={template.id} className="template">
                <Template data={template} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default TemplateContainer;
