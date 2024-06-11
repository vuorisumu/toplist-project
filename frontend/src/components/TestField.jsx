import { useState, useEffect } from "react";
import {
  addNewUser,
  fetchAllTemplates,
  fetchTemplateById,
  fetchTemplateCount,
  fetchUserByName,
} from "./api";
import { formatData } from "../util/dataHandler";
import TemplateContainer from "./TemplateContainer";
import { getUserId } from "./util";

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

  const test = async () => {
    fetchTemplateById(24)
      .then((res) => {
        console.log(formatData(res));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <button type="button" onClick={test} className="loadMoreButton">
        Test
      </button>
    </>
  );
}

export default TestField;
