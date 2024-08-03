import { useContext, useEffect, useState } from "react";
import UserContext from "../util/UserContext";
import { formatData } from "../util/dataHandler";
import { fetchAllTemplatesFromUser } from "../api/templates";
import Template from "./Template";

function MyTemplates() {
  const [templates, setTemplates] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.id) {
      fetchAllTemplatesFromUser(user.id)
        .then((data) => {
          const formattedData = formatData(data);
          setTemplates(formattedData);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="container">
      <h1>My templates</h1>
      {loading ? (
        <p>Loading templates</p>
      ) : templates.length > 0 ? (
        <ul className="lists">
          {templates.map((t) => (
            <li key={`template${t.name}`} className="template">
              <Template data={t} showCreator={false} allowEdit={true} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No templates found!</p>
      )}
    </div>
  );
}

export default MyTemplates;
