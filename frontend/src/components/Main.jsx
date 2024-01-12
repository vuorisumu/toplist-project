import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllTemplates, fetchAllTemplatesFiltered } from "./api";
import { checkAdminStatus } from "./util";
import Dropdown from "./Dropdown";
import SearchInput from "./SearchInput";

function Main() {
  const [templates, setTemplates] = useState([]);
  const [loadedTemplates, setLoadedTemplates] = useState(0);
  const loadSize = 5;
  const [filters, setFilters] = useState("sortBy=id&sortOrder=desc");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [sortBy, setSortBy] = useState("Name");

  const sortByOptions = [
    "Template name",
    "Oldest first",
    "Newest first",
    "Creator name",
  ];

  const creatorNames = ["Testi", "Testi 2"];

  useEffect(() => {
    fetchRecent();
  }, []);

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

  const handleTemplateName = (val) => {
    setSearchTemplate(val);
  };

  const handleCreatorName = (val) => {
    setSearchUser(val);
  };

  const selectFromDropdown = (val) => {
    setSortBy(val);
  };

  const filteredSearch = () => {
    console.log("Searching");
    console.log("Template name: " + searchTemplate);
    console.log("User name: " + searchUser);
    console.log("Sort by: " + sortBy);
  };

  return (
    <>
      <h1>Main</h1>
      <div>
        <h2>Filter templates</h2>
        <label>Search template by name: </label>
        <SearchInput
          suggestionData={creatorNames}
          onChange={handleTemplateName}
          onSelected={handleTemplateName}
        />
        <label>Search from creator: </label>
        <SearchInput
          suggestionData={creatorNames}
          onChange={handleCreatorName}
          onSelected={handleCreatorName}
        />
        <Dropdown
          label={"Sort by"}
          placeholder={"Name"}
          items={sortByOptions}
          onSelect={selectFromDropdown}
        />

        <button type="button" onClick={filteredSearch}>
          Search
        </button>
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
