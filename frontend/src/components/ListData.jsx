import { useEffect, useRef, useState } from "react";
import { fetchTemplateById } from "../api/templates";
import { formatData } from "../util/dataHandler";
import { getImgUrl } from "../util/imageHandler";
import { v4 as uuid } from "uuid";
import TemplateInfo from "./TemplateInfo";

function ListData({ data, templateId, onSubmit, submitText, creating }) {
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
  const [imgUrl, setImgUrl] = useState("");
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

        if (formatted.cover_image) {
          const url = getImgUrl(formatted.cover_image);
          setImgUrl(url);
        }

        if (formatted.settings?.hasImages === true) {
          setHasImages(true);
        }

        // Add uuid() to each item
        let setIds = [];
        if (!formatted.settings?.isBlank) {
          setIds = data
            ? formatted.items.filter(
                (item) =>
                  !data.items.some((i) => i.item_name === item.item_name)
              )
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
    console.log(containers);
  }, [containers]);

  return (
    <div>
      <h2>Morjesta</h2>
      <TemplateInfo data={template} />
    </div>
  );
}

export default ListData;
