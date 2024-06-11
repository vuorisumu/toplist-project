import { useState, useEffect } from "react";
import {
  addNewUser,
  fetchAllTemplates,
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

  const showTemplates = () => {
    console.log(templates);
  };

  const getTemplateCount = async () => {
    fetchTemplateCount().then((result) => {
      console.log(formatData(result));
    });
  };

  const testUserFetch = async () => {
    getUserId("admin")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  };

  const testUserAdd = async () => {
    const newUser = {
      user_name: "test",
    };
    addNewUser(newUser)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <button type="button" onClick={testUserFetch} className="loadMoreButton">
        Test
      </button>
    </>
  );
}

export default TestField;
