import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatData } from "../util/dataHandler";
import Template from "./Template";
import Toplist from "./Toplist";
import { fetchAllTemplatesFromUser } from "../api/templates";
import { fetchAllListsByUser } from "../api/toplists";
import { fetchUserByName } from "../api/users";

function User() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [lists, setLists] = useState(null);
  const [loadingLists, setLoadingLists] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();
  const userName = decodeURI(location.pathname.replace("/user/", ""));

  useEffect(() => {
    if (userName !== "") {
      fetchUserByName(userName)
        .then((data) => {
          const formattedData = formatData(data);
          if (formattedData.length > 0) {
            setUserData(formattedData[0]);
          } else {
            setNotFound(true);
          }
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

  if (notFound) {
    return (
      <div className="container">
        <h1>Not found</h1>
        <p>User doesn't exist</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>{userData.user_name}</h2>

      <div>
        <h3>Templates</h3>
        {loadingTemplates ? (
          <p>Loading templates...</p>
        ) : templates.length <= 0 ? (
          <p>No templates created</p>
        ) : (
          <>
            <p>Templates created by {userData.user_name}:</p>
            <ul className="lists">
              {templates.map((template) => (
                <li key={template.id} className="template">
                  <Template data={template} showCreator={false} />
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
            <ul className="lists">
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
