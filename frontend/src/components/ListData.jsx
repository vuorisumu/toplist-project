import { useContext, useEffect, useRef, useState } from "react";
import { fetchTemplateById } from "../api/templates";
import { formatData } from "../util/dataHandler";
import { getImgUrl } from "../util/imageHandler";
import { v4 as uuid } from "uuid";
import TemplateInfo from "./TemplateInfo";
import RankItems from "./RankItems";
import AddItems from "./AddItems";
import SaveList from "./SaveList";
import UserContext from "../util/UserContext";
import { clearAll } from "../util/misc";

function ListData({ data, templateId, onSubmit, submitText, creating }) {
  const { user } = useContext(UserContext);
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
  const [listName, setListName] = useState(data?.toplist_name || "");
  const [desc, setDesc] = useState(data?.toplist_desc || "");
  const [containers, setContainers] = useState(itemContainers);
  const [newEntry, setNewEntry] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [hasImages, setHasImages] = useState(false);
  const [newImage, setNewImage] = useState({});
  const [addedImages, setAddedImages] = useState([]);
  const imgRef = useRef();
  const [addedItemCount, setAddedItemCount] = useState(0);
  const [copyTemplate, setCopyTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [loadingNewTemplate, setLoadingNewTemplate] = useState(false);

  useEffect(() => {
    fetchTemplateById(templateId)
      .then((t) => {
        const formatted = formatData(t)[0];
        setTemplate(formatted);

        if (formatted.settings?.hasImages === true) {
          setHasImages(true);
        }

        // Add uuid() to each item
        let setIds = [];
        if (!formatted.settings?.isBlank) {
          setIds = data
            ? formatted.items
                .filter(
                  (item) =>
                    !data.ranked_items.some(
                      (i) => i.item_name === item.item_name
                    )
                )
                .map((i) => ({ ...i, id: uuid() }))
            : formatted.items.map((item) => ({ ...item, id: uuid() }));
        }

        // set initial containers
        setContainers((cont) => {
          const containers = {
            [ITEMS_RANKED]: {
              ...cont[ITEMS_RANKED],
              items: data?.ranked_items || [],
              isBlank: formatted.settings?.isBlank === true,
            },
          };

          // add unranked container only if template is not blank
          if (!formatted.settings?.isBlank) {
            containers[ITEMS_REMAINING] = {
              ...cont[ITEMS_REMAINING],
              items: setIds || [],
              isBlank: false,
            };
          }

          return containers;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [templateId]);

  useEffect(() => {
    let count = 0;
    for (let key in containers) {
      containers[key].items.map((i) => {
        if (i.deletable === true) {
          count++;
        }
      });
    }

    setAddedItemCount(count);

    if (count <= 0) {
      setCopyTemplate(false);
    }
  }, [containers]);

  const handleAddEntry = (entry, image) => {
    if (image) {
      setAddedImages((prevImages) => [...prevImages, image]);
    }

    const contName =
      template.settings?.isBlank === true ? ITEMS_RANKED : ITEMS_REMAINING;
    if (template.settings?.isBlank === true) {
      entry.rank_number = containers[ITEMS_RANKED].items.length + 1;
    }

    setContainers((prevContainers) => ({
      ...prevContainers,
      [contName]: {
        ...prevContainers[contName],
        items: [...prevContainers[contName].items, entry],
      },
    }));
  };

  const handleError = (err) => {
    console.log(err);
  };

  const handleSave = () => {
    console.log("save");
  };

  return (
    <div className="createRank">
      <h2>{data ? "Edit Top List" : "Create a Top List"}</h2>
      {/* Template info */}
      <TemplateInfo data={template} />

      {/* Top list info */}
      <div className="rankInfo">
        <label>Title:</label>
        <input
          type="text"
          id="addRankTitle"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="For example: Top 5 movies"
        />

        <label>Description:</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Write something about your top list"
        />
      </div>

      {/* Ranking builder */}
      <RankItems containers={containers} setContainers={setContainers} />

      {/* Allow adding images on blank templates */}
      {template?.settings?.isBlank === true && addedItemCount <= 0 && (
        <div>
          <label>Add images: </label>
          <div className="toggle">
            <input
              type="checkbox"
              name="toggleImages"
              id="toggleImages"
              checked={hasImages}
              onChange={() => setHasImages(!hasImages)}
            />
            <label htmlFor="toggleImages"></label>
          </div>
        </div>
      )}

      <AddItems
        hasImages={hasImages}
        addEntry={handleAddEntry}
        sendError={handleError}
      />

      <div>
        {addedItemCount > 0 && user && !template.settings?.isBlank && (
          <SaveList
            template={template}
            setCopyTemplate={setCopyTemplate}
            setNewTempName={setNewTemplateName}
            setNewTempDesc={setNewTemplateDesc}
          />
        )}

        {errorMessages.length > 0 && (
          <ul>
            {errorMessages.map((err, i) => (
              <li key={`error${i}`}>{err}</li>
            ))}
          </ul>
        )}

        <button type="button" onClick={handleSave}>
          Save List
        </button>

        <button type="button" onClick={clearAll}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default ListData;
