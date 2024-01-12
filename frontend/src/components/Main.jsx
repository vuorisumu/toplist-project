import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllTemplates, fetchAllTemplatesFiltered } from "./api";
import { checkAdminStatus } from "./util";
import Dropdown from "./Dropdown";

function Main() {
  const [templates, setTemplates] = useState([]);
  const [loadedTemplates, setLoadedTemplates] = useState(0);
  const loadSize = 5;
  const [filters, setFilters] = useState("sortBy=id&sortOrder=desc");

  useEffect(() => {
    fetchRecent();
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const selectFromDropdown = (val) => {
    console.log(val);
  };

  // fetch the newest templates
  async function fetchRecent() {
    fetchAllTemplatesFiltered(`sortBy=id&sortOrder=desc&limit=${loadSize}`)
      .then((data) => {
        if (loadedTemplates === 0) {
          setTemplates(data);
        } else {
          setTemplates((prevTemplates) => [...prevTemplates, ...data]);
        }
        setLoadedTemplates(loadedTemplates + loadSize);
      })
      .catch((err) => console.log(err));
  }

  async function fetchMore() {
    let limit = `${loadedTemplates},${loadSize}`;
    fetchAllTemplatesFiltered(`${filters}&limit=${limit}`)
      .then((data) => {
        if (loadedTemplates === 0) {
          setTemplates(data);
        } else {
          setTemplates((prevTemplates) => [...prevTemplates, ...data]);
        }
        setLoadedTemplates(loadedTemplates + loadSize);
      })
      .catch((err) => console.log(err));
  }

  async function fetchAll() {
    fetchAllTemplates()
      .then((data) => setTemplates(data))
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchAllFiltered(filters) {
    fetchAllTemplatesFiltered(filters)
      .then((data) => setTemplates(data))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <h1>Main</h1>
      <div>
        <h2>Filter templates</h2>
        <button onClick={fetchAll}>Fetch all</button>
        <button onClick={() => fetchAllFiltered("sortBy=creatorname")}>
          Sort by creator name
        </button>
        <Dropdown
          isOpen={open}
          openTrigger={<button onClick={handleOpen}>Dropdown</button>}
          items={["Yksi", "Kaksi"]}
          onSelect={selectFromDropdown}
        />
      </div>
      <div>
        <ul>
          {templates.map((t) => (
            <li key={t.id}>
              <Link to={`/createlisting/${t.id}`}>
                <h2>{t.name}</h2>
              </Link>
              <p>Creator: {t.user_name ? t.user_name : "Anonymous"}</p>
              {(t.editkey || checkAdminStatus()) && (
                <Link to={`/edit-template/${t.id}`}>Edit template</Link>
              )}
              <ul>
                {JSON.parse(t.items).map((item, index) => (
                  <li key={index}>{item.item_name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <button type="button" onClick={fetchMore}>
          Load more
        </button>
      </div>
    </>
  );
}

export default Main;
