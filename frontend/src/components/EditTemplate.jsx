import { useLocation } from "react-router-dom";

function EditTemplate() {
  const location = useLocation();
  const templateId = parseInt(location.pathname.replace("/edit-template/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }
}

export default EditTemplate;
