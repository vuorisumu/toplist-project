import { useContext, useEffect, useRef, useState } from "react";
import { addNewTemplate, fetchTemplateById } from "../api/templates";
import { formatData } from "../util/dataHandler";
import { v4 as uuid } from "uuid";
import TemplateInfo from "./TemplateInfo";
import RankItems from "./RankItems";
import AddItems from "./AddItems";
import SaveList from "./SaveList";
import UserContext from "../util/UserContext";
import { clearAll } from "../util/misc";
import { addNewImages } from "../api/images";
import { addNewToplist } from "../api/toplists";
import { useNavigate } from "react-router-dom";

function ListData({ data, templateId, onSubmit, submitText, creating }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
  const [errorMessages, setErrorMessages] = useState([]);
  const [hasImages, setHasImages] = useState(false);
  const [addedImages, setAddedImages] = useState([]);
  const [addedItemCount, setAddedItemCount] = useState(0);
  const [copyTemplate, setCopyTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState(false);
  const newTemplateId = useRef(templateId);

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
        setDataError(true);
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

  const addTemplateCopy = async () => {
    try {
      const tempItems = [];
      for (let key in containers) {
        containers[key].items.map((i) => {
          tempItems.push({ item_name: i.item_name });
        });
      }

      const templateData = {
        name: newTemplateName !== "" ? newTemplateName : template.name,
        items: tempItems,
        category: template.category,
        creator_id: user.id,
        settings: {
          hasImages: hasImages,
          isBlank: false,
        },
      };

      if (newTemplateDesc.trim() !== "") {
        templateData.description = newTemplateDesc;
      } else if (template.description) {
        templateData.description = template.description;
      }

      const res = await addNewTemplate(templateData);
      newTemplateId.current = res.id;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    const errors = [];
    const nonEmptyRanked = containers[ITEMS_RANKED].items
      .filter((i) => i.item_name.trim() !== "")
      .map((i) => {
        const { img_url: _, ...rest } = i;
        return rest;
      });

    const userAdded = containers[ITEMS_RANKED].items
      .filter((i) => i.deletable === true)
      .map((i) => {
        return addedImages.find((img) => img.id === i.img_id);
      })
      .filter((img) => img !== undefined);
    console.log(userAdded);

    if (nonEmptyRanked.length === 0) {
      errors.push("Top list container must have at least one item");
      document.getElementById("ranked").classList.add("error");
    } else {
      document.getElementById("ranked").classList.remove("error");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    setLoading(true);
    if (copyTemplate && addedItemCount > 0) {
      console.log("Copying template");
      await addTemplateCopy();
      console.log("New id", newTemplateId.current);
    }

    try {
      const newListName =
        listName.trim() !== ""
          ? listName
          : `${template.name} ranked by ${user ? user.name : "Anonymous"}`;

      const toplistData = {
        toplist_name: newListName,
        template_id: newTemplateId.current,
        ranked_items: nonEmptyRanked,
      };

      if (user && !data) toplistData.creator_id = user.id;
      if (desc !== "") toplistData.toplist_desc = desc;

      if (data) {
        toplistData.edited = new Date();
      } else {
        toplistData.creation_time = new Date();
      }

      console.log(toplistData);
      if (userAdded.length > 0) {
        const imgRes = await addNewImages(userAdded);
        console.log(imgRes);
      }

      onSubmit(toplistData);
    } catch (err) {
      console.log(err);
    }
  };

  if (dataError) {
    return (
      <div>
        <h1>Error</h1>
        <p>No template found with the id {templateId}</p>
      </div>
    );
  }

  return (
    <div className="createRank">
      <h1>{data ? "Edit Top List" : "Create a Top List"}</h1>
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
        {addedItemCount > 0 && user && !data && !template.settings?.isBlank && (
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

        <button type="button" onClick={handleSave} disabled={loading}>
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
