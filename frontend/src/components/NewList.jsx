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
import ListData from "./ListData";

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

  const [notFound, setNotFound] = useState(false);
  const [template, setTemplate] = useState(null);
  const [newEntry, setNewEntry] = useState("");
  const [hasImages, setHasImages] = useState(false);
  const [newImage, setNewImage] = useState({});
  const imgRef = useRef();
  const [copyTemplate, setCopyTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const newTemplateId = useRef(templateId);

  /**
   * Saves the ranking data to database if the minimum requirements are met.
   * Minimum requirements are: at least one item ranked
   * Trims all input fields from possible extra spaces
   */
  const saveToplist = async (toplistData) => {
    try {
      const res = await addNewToplist(toplistData);
      navigate(`/toplists/${res.toplist_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <ListData
        templateId={templateId}
        onSubmit={saveToplist}
        submitText={"Save Changes"}
      />
    </div>
  );
}

export default NewList;
