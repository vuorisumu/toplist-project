import { Link, useLocation, useNavigate } from "react-router-dom";
import ToplistContainer from "./ToplistContainer";
import { useEffect, useState } from "react";
import { fetchTemplateById } from "../api/templates";
import { formatData } from "../util/dataHandler";
import { getImgUrl } from "../util/imageHandler";
import { getCategoryById } from "../util/storage";

function TemplatePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const templateId = parseInt(location.pathname.replace("/templates/", ""));
  const [template, setTemplate] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [category, setCategory] = useState("");

  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  useEffect(() => {
    fetchTemplateById(templateId)
      .then((data) => {
        const formattedData = formatData(data)[0];
        setTemplate(formattedData);

        if (formattedData.cover_image) {
          const url = getImgUrl(formattedData.cover_image);
          setImgUrl(url);
        }
      })
      .catch((err) => {
        console.log(err);
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

  const createList = () => {
    navigate(`/createlist/${templateId}`);
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
        <h1>Template preview</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="templateInfo">
        <h1>{template.name}</h1>
        {/* Template information */}
        {imgUrl && (
          <div className="coverImage">
            <img src={imgUrl} />
          </div>
        )}

        <p>
          Template by
          {template.user_name ? (
            <Link to={`/user/${template.user_name}`}>
              {" "}
              {template.user_name}
            </Link>
          ) : (
            "Unknown"
          )}
        </p>
        <p>Category: {category}</p>

        <p className="desc">
          {template.description
            ? `Template description: ${template.description}`
            : `Create your own top list using this template`}
        </p>

        <div className="itemsPreview">
          <h4>Items in this template:</h4>
          <ul>
            {template.items.map((i) => (
              <li key={i.item_name}>{i.item_name}</li>
            ))}
          </ul>
        </div>

        <Link to={`/createlist/${templateId}`}>
          <h3>Use this template</h3>
        </Link>
      </div>

      <ToplistContainer templateId={templateId} />
    </div>
  );
}

export default TemplatePreview;
