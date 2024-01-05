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

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    fetchTemplateById(templateId)
      .then((data) => {
        setTemplate(data[0]);
        console.log(data[0]);
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
