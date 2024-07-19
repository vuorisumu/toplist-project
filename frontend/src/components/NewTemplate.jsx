import { useEffect, useState } from "react";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../util/permissions";
import { addNewTemplate, testAddNewTemplate } from "../api/templates";
import TemplateData from "./TemplateData";

/**
 * View where the user can create a new template and add it to the database.
 * Renders a message asking the user to log in if the user hasn't logged in,
 * and renders the template creation view only if the user has logged in as either
 * admin or creator.
 *
 * @returns {JSX.Element} New template creation component
 */
function NewTemplate() {
  const navigate = useNavigate();
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setCanCreate(true);
    } else {
      setCanCreate(false);
    }
  }, []);

  /**
   * Tries to add the template to the database. Does nothing if the minimum
   * requirements haven't been met. Otherwise builds the template data and
   * sends it to the database.
   */
  const createTemplate = async (templateData) => {
    try {
      console.log(templateData);
      const res = await testAddNewTemplate(templateData);
      navigate(`/createlist/${res.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  if (!canCreate) {
    return (
      <div className="container">
        <div className="center">
          <p>Please login to create new template</p>
          <Login isFixed={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>New Template</h1>
      <div className="no-stretch newTemplate">
        <TemplateData onSubmit={createTemplate} submitText="Create" />
      </div>
    </div>
  );
}

export default NewTemplate;
