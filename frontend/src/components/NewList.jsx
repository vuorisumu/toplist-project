import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { clearAll } from "../util/misc";
import { formatData } from "../util/dataHandler";
import ToplistContainer from "./ToplistContainer";
import { isCreatorOfTemplate } from "../util/permissions";
import { getCategoryById } from "../util/storage";
import { addNewTemplate, fetchTemplateById } from "../api/templates";
import { addNewToplist } from "../api/toplists";
import { getImgUrl, getItemImages, resizeImage } from "../util/imageHandler";
import { addNewImages } from "../api/images";
import RankItems from "./RankItems";
import UserContext from "../util/UserContext";

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
  const { user } = useContext(UserContext);

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
    },
    [ITEMS_REMAINING]: {
      name: "Unused items",
      keyName: ITEMS_REMAINING,
      items: [],
    },
  };

  const [notFound, setNotFound] = useState(false);
  const [template, setTemplate] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [containers, setContainers] = useState(itemContainers);
  const [toplistName, setToplistName] = useState("");
  const [toplistDesc, setToplistDesc] = useState("");
  const [newEntry, setNewEntry] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [category, setCategory] = useState("");
  const [hasImages, setHasImages] = useState(false);
  const [newImage, setNewImage] = useState({});
  const [addedImages, setAddedImages] = useState([]);
  const imgRef = useRef();
  const [addedItemCount, setAddedItemCount] = useState(0);
  const [copyTemplate, setCopyTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [loadingNewTemplate, setLoadingNewTemplate] = useState(false);
  const newTemplateId = useRef(templateId);

  /**
   * On page load, fetch necessary template data from the database
   * and buiild the necessary containers for the items to be used in the ranking
   */
  useEffect(() => {
    fetchTemplateById(templateId)
      .then((data) => {
        const formattedData = formatData(data)[0];
        setTemplate(formattedData);

        if (formattedData.cover_image) {
          const url = getImgUrl(formattedData.cover_image);
          setImgUrl(url);
        }

        if (formattedData.settings?.hasImages === true) {
          setHasImages(true);
        }

        // Add uuid() to each item
        const setIds =
          formattedData.settings?.isBlank === true
            ? []
            : formattedData.items.map((item) => ({
                ...item,
                id: uuid(),
              }));

        // set initial containers
        setContainers((cont) => ({
          [ITEMS_RANKED]: {
            ...cont[ITEMS_RANKED],
            items: [],
          },
          [ITEMS_REMAINING]: {
            ...cont[ITEMS_REMAINING],
            items: setIds || [],
            isBlank: formattedData.settings?.isBlank === true,
          },
        }));
      })
      .catch((err) => {
        setNotFound(true);
      });
  }, [templateId]);

  useEffect(() => {
    if (template) {
      getCategoryById(template.category).then((data) => {
        setCategory(data);
      });
    }
  }, [template]);

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

  /**
   * Toggles the copy template setting.
   */
  const toggleCopyTemplate = () => {
    setCopyTemplate(!copyTemplate);
  };

  /**
   * Adds a new item to be used in the ranking. Will not save the item to the actual template,
   * and can be deleted during the ranking, unlike the items that belong to the original template.
   * Only adds a new item if the name of the entry is not blank
   */
  const addEntry = () => {
    if (hasImages && !newImage.id) {
      setErrorMessages(["New item must have an image"]);
      document.getElementById("newItemsCont").classList.add("error");
    } else {
      document.getElementById("newItemsCont").classList.remove("error");
    }

    // only adds new if entry isn't empty
    if (newEntry.trim() !== "" && (!hasImages || (hasImages && newImage.id))) {
      const addedEntry = {
        item_name: newEntry,
        deletable: true,
        id: uuid(),
      };

      if (hasImages) {
        addedEntry.img_id = newImage.id;
        addedEntry.img_url = URL.createObjectURL(newImage.img);

        setAddedImages((prevImages) => [...prevImages, newImage]);
      }

      if (template.settings?.isBlank) {
        // add new entry straight to ranked container when template is blank
        setContainers((prevContainers) => ({
          [ITEMS_RANKED]: {
            ...prevContainers[ITEMS_RANKED],
            items: [...prevContainers[ITEMS_RANKED].items, addedEntry],
          },
        }));
      } else {
        setContainers((prevContainers) => ({
          ...prevContainers,
          [ITEMS_REMAINING]: {
            ...prevContainers[ITEMS_REMAINING],
            items: [...prevContainers[ITEMS_REMAINING].items, addedEntry],
          },
        }));
      }

      // reset entry
      setNewEntry("");

      if (hasImages) {
        setNewImage({});
        imgRef.current.value = "";
      }
    }
  };

  /**
   * Resizes the given image and adds it to state.
   *
   * @param {ChangeEvent} e - event containing information about the current value
   */
  const handleAddItemImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resized = await resizeImage(file, {
        maxWidth: 150,
        maxHeight: 150,
      });
      const imgId = uuid();
      setNewImage({
        id: imgId,
        img: resized,
      });
      console.log("added imgae");
    } else {
      console.log("no file");
    }
  };

  const addTemplateCopy = async () => {
    try {
      setLoadingNewTemplate(true);
      const tempItems = [];
      for (let key in containers) {
        containers[key].items.map((i) => {
          tempItems.push({ item_name: i.item_name });
        });
      }

      const templateData = {
        name: newTemplateName || template.name,
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

  /**
   * Saves the ranking data to database if the minimum requirements are met.
   * Minimum requirements are: at least one item ranked
   * Trims all input fields from possible extra spaces
   */
  const saveToplist = async () => {
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

    if (copyTemplate) {
      console.log("Copying template", templateId);
      await addTemplateCopy();
      console.log("New id", newTemplateId.current);
    }

    try {
      const listName =
        toplistName.trim() !== ""
          ? toplistName
          : `${template.name} ranked by ${user ? user.user_name : "Anonymous"}`;

      // store toplist data
      const toplistData = {
        toplist_name: listName,
        template_id: newTemplateId.current,
        ranked_items: nonEmptyRanked,
        creation_time: new Date(),
      };

      // user id if logged in
      if (user) {
        toplistData.creator_id = user.id;
      }

      // optional description
      if (toplistDesc !== "") {
        toplistData.toplist_desc = toplistDesc;
      }

      if (userAdded.length > 0) {
        const imgRes = await addNewImages(userAdded);
        console.log(imgRes);
      }

      const res = await addNewToplist(toplistData);
      navigate(`/toplists/${res.toplist_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (notFound) {
    return (
      <div className="container">
        <h1>Not found</h1>
        <p>Template doesn't exist or it has been deleted</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container">
        <h1>Create a Top List</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="createRank">
        <h1>Create a Top List</h1>

        {/* Template information */}
        <div className="templateInfo">
          <p>
            Template:{" "}
            <Link to={`/templates/${templateId}`}>
              <span className="alt">{template.name}</span>
            </Link>{" "}
            by{" "}
            {template.user_name ? (
              <Link to={`/user/${template.user_name}`}>
                {template.user_name}
              </Link>
            ) : (
              "Unknown"
            )}
          </p>

          {imgUrl && (
            <div className="coverImage">
              <img src={imgUrl} />
            </div>
          )}

          <p>Category: {category}</p>

          <p className="desc">
            {template.description
              ? `Template description: ${template.description}`
              : `Create your own top list using this template`}
          </p>
        </div>

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
        <RankItems containers={containers} setContainers={setContainers} />

        {/* Add new items */}
        <div className="newItemsCont" id="newItemsCont">
          {hasImages && (
            <div className="itemImage">
              {newImage?.img ? (
                <img src={URL.createObjectURL(newImage.img)} />
              ) : (
                <span className="material-symbols-outlined imagePlaceholder">
                  image
                </span>
              )}
            </div>
          )}
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="New Item"
          />
          {hasImages && (
            <label className="fileInput">
              <input
                type="file"
                ref={imgRef}
                id={`newImage`}
                name={`newImage`}
                accept="image/png, image/gif, image/jpeg"
                onChange={handleAddItemImage}
              />
            </label>
          )}
          <button type="button" onClick={addEntry}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Save changes */}
        <div>
          {addedItemCount > 0 && user && !template.settings?.isBlank && (
            <div>
              <div>
                <label>Save as new template: </label>
                <div className="toggle">
                  <input
                    type="checkbox"
                    name="toggleNewTemplate"
                    id="toggleNewTemplate"
                    className="menu"
                    checked={copyTemplate}
                    onChange={toggleCopyTemplate}
                  />
                  <label htmlFor="toggleNewTemplate"></label>
                </div>
              </div>

              {copyTemplate && (
                <>
                  <p>
                    Makes a copy of the original template and saves it with your
                    additions.
                  </p>
                  <div className="rankInfo">
                    <label>New template name:</label>
                    <input
                      type="text"
                      id="newTemplateName"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder={template.name}
                    />

                    <label>New template description: </label>
                    <textarea
                      value={newTemplateDesc}
                      onChange={(e) => setNewTemplateDesc(e.target.value)}
                      placeholder={template.description}
                    />
                  </div>
                </>
              )}
            </div>
          )}

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
    </div>
  );
}

export default NewList;
