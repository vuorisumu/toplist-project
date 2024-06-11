import { useState, useEffect } from "react";
import { fetchAllTemplatesFiltered, fetchTemplateCount } from "./api";
import { formatData, getCountFromData } from "../util/dataHandler";

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
        const test = formatData(data);
        test.map((testTemplate) => {
          console.log(testTemplate.name);
        });
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div>
        <h2>Recent templates</h2>
        {templates.length < 1 && <p>No templates found</p>}
        {loading ? (
          <p>Loading</p>
        ) : (
          <ul>
            <li key={"count"}>
              <p>Template count: {templateCount}</p>
            </li>
            {templates.map((template) => (
              <li key={template.id}>
                <p>{template.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default TemplateContainer;
