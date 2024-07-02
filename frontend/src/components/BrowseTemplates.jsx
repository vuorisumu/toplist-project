import TemplateContainer from "./TemplateContainer";

/**
 * View for browsing templates
 *
 * @returns {JSX.Element} Container component for templates
 */
function BrowseTemplates() {
  return (
    <div className="container">
      <h1>Templates</h1>
      <TemplateContainer />
    </div>
  );
}

export default BrowseTemplates;
