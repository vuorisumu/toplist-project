import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchTemplateById } from "./api";

function CreateListing() {
  const location = useLocation();
  const templateId = parseInt(location.pathname.replace("/createlisting/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  const ITEMS_RANKED = "ranked";
  const ITEMS_REMAINING = "unused";
  const itemContainers = {
    [ITEMS_RANKED]: {
      name: "Ranked",
      keyName: "rank",
      items: [],
    },
    [ITEMS_REMAINING]: {
      name: "Unused items",
      keyName: "remaining",
      items: [],
    },
  };

  const [template, setTemplate] = useState(null);
  const [containers, setContainers] = useState(itemContainers);

  // fetch selected template
  useEffect(() => {
    fetchTemplateById(templateId)
      .then((data) => {
        setTemplate(data[0]);
        console.log(data[0]);

        // set initial containers
        setContainers((cont) => ({
          [ITEMS_RANKED]: { ...cont[ITEMS_RANKED], items: [] },
          [ITEMS_REMAINING]: {
            ...cont[ITEMS_REMAINING],
            items: JSON.parse(data[0].items) || [],
          },
        }));

        // test that all items correctly go to remaining container
        containers[ITEMS_REMAINING].items.map((i) => {
          console.log(i);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [templateId]);

  return (
    <div>
      <h1>Create a Ranking</h1>
      {template && (
        <div>
          <p>Template name: {template.name}</p>
          <p>Template creator: {template.user_name}</p>

          <p>Items: </p>
          {JSON.parse(template.items).map((item, index) => (
            <p key={index}>{item.item_name}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateListing;
