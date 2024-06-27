import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchAllListsByUser,
  fetchAllTemplatesFromUser,
  fetchUserByName,
} from "./api";
import { formatData } from "../util/dataHandler";
import Template from "./Template";
import Toplist from "./Toplist";

function User() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [lists, setLists] = useState(null);
  const [loadingLists, setLoadingLists] = useState(true);
  const location = useLocation();
  const userName = decodeURI(location.pathname.replace("/user/", ""));

  useEffect(() => {
    if (userName !== "") {
      fetchUserByName(userName)
        .then((data) => {
          const formattedData = formatData(data);
          setUserData(formattedData[0]);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (userData !== null) {
      fetchAllTemplatesFromUser(userData.user_id).then((data) => {
        const formattedData = formatData(data);
        setTemplates(formattedData);
        setLoadingTemplates(false);
      });

      fetchAllListsByUser(userData.user_id).then((data) => {
        const formattedData = formatData(data);
        setLists(formattedData);
        setLoadingLists(false);
      });
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>{userData.user_name}</h2>
      <p>User page here</p>

      <div>
        <h3>Templates</h3>
        {loadingTemplates ? (
          <p>Loading templates...</p>
        ) : templates.length <= 0 ? (
          <p>No templates created</p>
        ) : (
          <>
            <p>Templates created by {userData.user_name}:</p>
            <ul>
              {templates.map((template) => (
                <li key={template.id} className="template">
                  <Template data={template} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div>
        <h3>Top lists</h3>
        {loadingLists ? (
          <p>Loading templates...</p>
        ) : lists.length <= 0 ? (
          <p>No top lists created</p>
        ) : (
          <>
            <p>Top lists created by {userData.user_name}:</p>
            <ul>
              {lists.map((list) => (
                <li key={list.id}>
                  <Toplist data={list} general={true} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default User;
