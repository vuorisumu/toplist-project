import { useState } from "react";

function Main() {
  const API_BASE_URL = "http://localhost:3000";
  const [templates, setTemplates] = useState([]);

  const fetchAll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/templates`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setTemplates(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

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
