import { useState } from "react";
import { fetchAllTemplates } from "./api";

function Main() {
  const [templates, setTemplates] = useState([]);

  async function fetchAll() {
    fetchAllTemplates()
      .then((data) => setTemplates(data))
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <h1>Main</h1>
      <button onClick={fetchAll}>Fetch</button>
      <ul>
        {templates.map((t) => (
          <li key={t.id}>
            <h2>{t.name}</h2>
            <ul>
              {JSON.parse(t.items).map((item, index) => (
                <li key={index}>{item.item_name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Main;
