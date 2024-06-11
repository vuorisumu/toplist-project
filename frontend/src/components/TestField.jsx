import { useState, useEffect } from "react";
import { fetchAllTemplates } from "./api";

function TestField() {
  const [templates, setTemplates] = useState([]);

  const getTemplates = async () => {
    console.log("template fetching started");
    fetchAllTemplates()
      .then((result) => {
        console.log("got result");
        if (result.length == 0) {
          console.log("haloo");
        }
        const data = [];
        result.rows.forEach((row) => {
          const dataRow = {};
          result.metaData.forEach((column, index) => {
            dataRow[column.name] = row[index];
          });
          data.push(dataRow);
        });
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
