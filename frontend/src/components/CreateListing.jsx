import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  addNewRanking,
  addNewUser,
  fetchTemplateById,
  fetchUserByName,
} from "./api";
import { DnDContainer } from "./Dnd";
import { v4 as uuid } from "uuid";
import { getLocalTime, clearAll, checkAdminStatus } from "./util";
import ShowRankings from "./ShowRankings";

/**
 * View where the user can create a new list from a chosen template.
 * The template ID is taken from the current pathname.
 * Shows the template name and creator and asks for user input for the ranking name, description and creator.
 * Uses DnD component for building the ranked list.
 * Provides an option to add new items to be used in the ranking.
 * Finally renders a ShowRankings component with current template ID
 */
function CreateListing() {
  const location = useLocation();
  const navigate = useNavigate();
  const templateId = parseInt(location.pathname.replace("/createranking/", ""));

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
  const [rankingName, setRankingName] = useState("");
  const [rankingDesc, setRankingDesc] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [newEntry, setNewEntry] = useState("");

  const [errorMessages, setErrorMessages] = useState([]);

  /**
   * On page load, fetch necessary template data from the database
   * and buiild the necessary containers for the items to be used in the ranking
   */
  useEffect(() => {
    fetchTemplateById(templateId)
      .then((data) => {
        setTemplate(data[0]);

        const blankAmount = 5;
        const blanks = [];
        for (let i = 0; i < blankAmount; i++) {
          blanks.push({
            item_name: " ",
            blank: true,
            id: uuid(),
          });
        }

        // Add uuid() to each item in data[0].items
        const setIds = JSON.parse(data[0].items).map((item) => ({
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
  const saveRanking = async () => {
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

    if (!rankingName) {
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
      // store ranking data
      let rankingData = {
        ranking_name: rankingName,
        template_id: templateId,
        ranked_items: nonEmptyRanked,
        creation_time: getLocalTime(),
      };

      // optional creator name
      if (creatorName !== "") {
        const fetchedUser = await fetchUserByName(creatorName.trim());
        if (fetchedUser.length > 0) {
          rankingData.creator_id = fetchedUser[0].user_id;
        } else {
          // add new user here
          const newUser = {
            user_name: creatorName,
          };

          const newUserResponse = await addNewUser(newUser);
          console.log(newUserResponse);
        }
      }

      // optional description
      if (rankingDesc !== "") {
        rankingData.ranking_desc = rankingDesc;
      }

      const res = await addNewRanking(rankingData);
      navigate(`/rankings/${res.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="createRank">
        <h1>Create a Top List</h1>

        {(template.editkey || checkAdminStatus()) && (
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
          {template.user_name}
        </p>

        {/* Ranking information */}
        <div className="rankInfo">
          <label>Title:</label>
          <input
            type="text"
            id="addRankTitle"
            value={rankingName}
            onChange={(e) => setRankingName(e.target.value)}
            placeholder="For example: Top 5 movies"
          />

          <label>Description: </label>
          <textarea
            value={rankingDesc}
            onChange={(e) => setRankingDesc(e.target.value)}
            placeholder="Write something about your top list"
          />

          <label>Creator name: </label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Creator name"
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
          <button type="button" onClick={saveRanking}>
            Save Ranking
          </button>

          <button type="button" onClick={clearAll}>
            Reset
          </button>
        </div>
      </div>
      <ShowRankings id={templateId} />
    </div>
  );
}

export default CreateListing;
