import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  addNewRanking,
  addNewUser,
  fetchTemplateById,
  fetchUserByName,
} from "./api";
import { DnDContainer } from "./Dnd";
import { v4 as uuid } from "uuid";
import { getLocalTime } from "./util";

function CreateListing() {
  const location = useLocation();
  const templateId = parseInt(location.pathname.replace("/createlisting/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  // drag n drop containers
  const ITEMS_RANKED = "ranked";
  const ITEMS_REMAINING = "unused";
  const itemContainers = {
    [ITEMS_RANKED]: {
      name: "Ranked",
      keyName: ITEMS_RANKED,
      items: [],
      default_size: 5,
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
  const [listSize, setListSize] = useState(5);

  // fetch selected template
  useEffect(() => {
    fetchTemplateById(templateId)
      .then((data) => {
        setTemplate(data[0]);

        const blankAmount = data[0].default_size || 5;
        setListSize(blankAmount);
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
            default_size: blankAmount,
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

  // adds new entry to template
  const addEntry = () => {
    // only adds new if entry isn't empty
    if (newEntry.trim() !== "") {
      setContainers((prevContainers) => ({
        ...prevContainers,
        [ITEMS_REMAINING]: {
          ...prevContainers[ITEMS_REMAINING],
          items: [
            ...prevContainers[ITEMS_REMAINING].items,
            { item_name: newEntry, deletable: true },
          ],
        },
      }));

      // reset entry
      setNewEntry("");
    }
  };

  // save ranking
  const saveRanking = async () => {
    if (containers[ITEMS_RANKED].items.length === 0 || !rankingName) {
      console.log("Cannot save");
      return;
    }

    try {
      // store ranking data
      let rankingData = {
        ranking_name: rankingName,
        template_id: templateId,
        items: containers[ITEMS_RANKED].items,
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
        rankingData.description = rankingDesc;
      }

      const res = await addNewRanking(rankingData);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const newSize = (size) => {
    let updatedItems = [];
    if (containers[ITEMS_RANKED].items.length > size) {
      console.log("more items than size");
      const firstItems = containers[ITEMS_RANKED].items.splice(0, size);
      updatedItems = firstItems;
    } else {
      console.log("less items than size");
      updatedItems = containers[ITEMS_RANKED].items;
      const blankAmount = size - containers[ITEMS_RANKED].items.length;
      for (let i = 0; i < blankAmount; i++) {
        updatedItems.push({
          item_name: " ",
          blank: true,
          id: uuid(),
        });
      }
    }

    setContainers((prevContainers) => ({
      ...prevContainers,
      [ITEMS_RANKED]: {
        ...prevContainers[ITEMS_RANKED],
        default_size: size,
        items: updatedItems,
      },
    }));
    setListSize(size);
  };

  // clear all fields
  const clearAll = () => {
    window.location.reload(false);
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Create a Ranking</h1>

      {/* Template information */}
      <div>
        <p>Template name: {template.name}</p>
        <p>Template creator: {template.user_name}</p>
      </div>

      {/* Ranking information */}
      <div>
        <label>Ranking title: </label>
        <input
          type="text"
          value={rankingName}
          onChange={(e) => setRankingName(e.target.value)}
          placeholder="Ranking Title"
        />
        <br />
        <label>Description: </label>
        <textarea
          value={rankingDesc}
          onChange={(e) => setRankingDesc(e.target.value)}
          placeholder="Ranking description"
        />
        <br />
        <label>Creator name: </label>
        <input
          type="text"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          placeholder="Creator Name"
        />
        <br />
        <label>Size: </label>
        <input
          type="range"
          id="listSize"
          min="1"
          max="50"
          value={listSize}
          onChange={(e) => newSize(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="50"
          value={listSize}
          onChange={(e) => newSize(e.target.value)}
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
      <div>
        <label>New item: </label>
        <input
          type="text"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="New Item"
        />
        <button type="button" onClick={addEntry}>
          Add
        </button>
      </div>

      {/* Save changes */}
      <div>
        <button type="button" onClick={saveRanking}>
          Save Ranking
        </button>

        <button type="button" onClick={clearAll}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default CreateListing;
