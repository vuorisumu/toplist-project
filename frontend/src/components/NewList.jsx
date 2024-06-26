import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DnDContainer } from "./Dnd";
import { v4 as uuid } from "uuid";
import { clearAll } from "../util/misc";
import { formatData } from "../util/dataHandler";
import ToplistContainer from "./ToplistContainer";
import { isCreatorOfTemplate } from "../util/permissions";
import { getCategoryById } from "../util/storage";
import { fetchTemplateById } from "../api/templates";
import { addNewToplist } from "../api/toplists";

/**
 * View where the user can create a new list from a chosen template.
 * The template ID is taken from the current pathname.
 * Shows the template name and creator and asks for user input for the ranking name, description and creator.
 * Uses DnD component for building the ranked list.
 * Provides an option to add new items to be used in the ranking.
 * Finally renders a ShowRankings component with current template ID
 *
 * @returns {JSX.Element} New list creation component
 */
function NewList() {
  const location = useLocation();
  const navigate = useNavigate();
  const templateId = parseInt(location.pathname.replace("/createlist/", ""));

  // drag n drop containers
  const ITEMS_RANKED = "ranked";
  const ITEMS_REMAINING = "unused";
  const itemContainers = {
    [ITEMS_RANKED]: {
      name: "Ranked",
      keyName: ITEMS_RANKED,
      items: [],
    },
    [ITEMS_REMAINING]: {
      name: "Unused items",
      keyName: ITEMS_REMAINING,
      items: [],
    },
  };

  const [template, setTemplate] = useState(null);
  const [containers, setContainers] = useState(itemContainers);
  const [toplistName, setToplistName] = useState("");
  const [toplistDesc, setToplistDesc] = useState("");
  const [newEntry, setNewEntry] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [category, setCategory] = useState("");

  /**
   * Checks if the user is logged in as admin or is the creator of the
   * currently chosen template.
   */
  const checkPermission = async () => {
    try {
      const isCreator = await isCreatorOfTemplate(templateId);
      setCanEdit(isCreator);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * On page load, fetch necessary template data from the database
   * and buiild the necessary containers for the items to be used in the ranking
   */
  useEffect(() => {
    checkPermission();

    fetchTemplateById(templateId)
      .then((data) => {
        console.log(data);
        const formattedData = formatData(data)[0];
        setTemplate(formattedData);

        const blankAmount = 5;
        const blanks = [];
        for (let i = 0; i < blankAmount; i++) {
          blanks.push({
            item_name: " ",
            blank: true,
            id: uuid(),
          });
        }

        // Add uuid() to each item
        const setIds = formattedData.items.map((item) => ({
          ...item,
          id: uuid(),
        }));

        // set initial containers
        setContainers((cont) => ({
          [ITEMS_RANKED]: {
            ...cont[ITEMS_RANKED],
            items: blanks,
          },
          [ITEMS_REMAINING]: {
            ...cont[ITEMS_REMAINING],
            items: setIds || [],
          },
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [templateId]);

  useEffect(() => {
    if (template) {
      getCategoryById(template.category).then((data) => {
        setCategory(data);
      });
    }
  }, [template]);

  /**
   * Adds a new item to be used in the ranking. Will not save the item to the actual template,
   * and can be deleted during the ranking, unlike the items that belong to the original template.
   * Only adds a new item if the name of the entry is not blank
   */
  const addEntry = () => {
    // only adds new if entry isn't empty
    if (newEntry.trim() !== "") {
      setContainers((prevContainers) => ({
        ...prevContainers,
        [ITEMS_REMAINING]: {
          ...prevContainers[ITEMS_REMAINING],
          items: [
            ...prevContainers[ITEMS_REMAINING].items,
            { item_name: newEntry, deletable: true, id: uuid() },
          ],
        },
      }));

      // reset entry
      setNewEntry("");
    }
  };

  /**
   * Saves the ranking data to database if the minimum requirements are met.
   * Minimum requirements are: at least one item ranked and the list is given a name.
   * Trims all input fields from possible extra spaces
   */
  const saveToplist = async () => {
    const errors = [];
    const nonEmptyRanked = containers[ITEMS_RANKED].items.filter(
      (i) => i.item_name.trim() !== ""
    );

    if (nonEmptyRanked.length === 0) {
      errors.push("Top list container must have at least one item");
      document.getElementById("Ranked").classList.add("error");
    } else {
      document.getElementById("Ranked").classList.add("error");
    }

    if (!toplistName) {
      errors.push("Top list must have a title");
      document.getElementById("addRankTitle").classList.add("error");
    } else {
      document.getElementById("addRankTitle").classList.remove("error");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      // store toplist data
      const toplistData = {
        toplist_name: toplistName,
        template_id: templateId,
        ranked_items: nonEmptyRanked,
        creation_time: new Date(),
      };

      // user id if logged in
      if (sessionStorage.getItem("userId")) {
        toplistData.creator_id = sessionStorage.getItem("userId");
      }

      // optional description
      if (toplistDesc !== "") {
        toplistData.toplist_desc = toplistDesc;
      }

      const res = await addNewToplist(toplistData);
      navigate(`/toplists/${res.toplist_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!template) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="createRank">
        <h1>Create a Top List</h1>

        {canEdit && (
          <Link to={`/edit-template/${template.id}`} className="editButton">
            <span
              className="material-symbols-outlined"
              aria-label="edit template"
            >
              edit_square
            </span>
          </Link>
        )}

        {/* Template information */}
        <p className="templateInfo">
          Template: <span className="alt">{template.name}</span> by{" "}
          {template.user_name ? (
            <Link to={`/user/${template.user_name}`}>{template.user_name}</Link>
          ) : (
            "Unknown"
          )}
        </p>

        <p className="templateInfo">Category: {category}</p>

        <p className="templateInfo desc">
          {template.description
            ? "Template description"
            : `Create your own top list using this template`}
          {template.description}
        </p>

        {/* Ranking information */}
        <div className="rankInfo">
          <label>Title:</label>
          <input
            type="text"
            id="addRankTitle"
            value={toplistName}
            onChange={(e) => setToplistName(e.target.value)}
            placeholder="For example: Top 5 movies"
          />

          <label>Description: </label>
          <textarea
            value={toplistDesc}
            onChange={(e) => setToplistDesc(e.target.value)}
            placeholder="Write something about your top list"
          />
        </div>

        {/* Ranking builder */}
        <DnDContainer
          containers={containers}
          setContainers={setContainers}
          ITEMS_RANKED={ITEMS_RANKED}
          ITEMS_REMAINING={ITEMS_REMAINING}
        />

        {/* Add new items */}
        <div className="newItemsCont">
          <label>New item: </label>
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="New Item"
          />
          <button type="button" onClick={addEntry}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Save changes */}
        <div>
          {errorMessages.length > 0 && (
            <ul>
              {errorMessages.map((err, index) => (
                <li key={"error" + index}>{err}</li>
              ))}
            </ul>
          )}
          <button type="button" onClick={saveToplist}>
            Save List
          </button>

          <button type="button" onClick={clearAll}>
            Reset
          </button>
        </div>
      </div>
      <ToplistContainer templateId={templateId} />
    </div>
  );
}

export default NewList;
