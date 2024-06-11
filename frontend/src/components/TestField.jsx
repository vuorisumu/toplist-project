import { useState, useEffect } from "react";
import { fetchAllTemplates, fetchTemplateCount } from "./api";
import { formatData } from "../util/dataHandler";
import TemplateContainer from "./TemplateContainer";

function TestField() {
  const [templates, setTemplates] = useState([]);

  const getTemplates = async () => {
    console.log("template fetching started");
    fetchAllTemplates()
      .then((result) => {
        const data = formatData(result);
        setTemplates(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showTemplates = () => {
    console.log(templates);
  };

  const getTemplateCount = async () => {
    fetchTemplateCount().then((result) => {
      console.log(formatData(result));
    });
  };

  return (
    <>
      <button type="button" onClick={getTemplates} className="loadMoreButton">
        Get Templates
      </button>
      <button type="button" onClick={showTemplates} className="loadMoreButton">
        Show Templates
      </button>
      <button
        type="button"
        onClick={getTemplateCount}
        className="loadMoreButton"
      >
        Get template count
      </button>
      <TemplateContainer />
    </>
  );
}

export default TestField;
