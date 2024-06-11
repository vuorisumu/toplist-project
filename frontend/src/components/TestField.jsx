import { useState, useEffect } from "react";
import { fetchAllTemplates } from "./api";
import { formatData } from "../util/dataHandler";

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

  return (
    <>
      <button type="button" onClick={getTemplates} className="loadMoreButton">
        Get Templates
      </button>
      <button type="button" onClick={showTemplates} className="loadMoreButton">
        Show Templates
      </button>
    </>
  );
}

export default TestField;
