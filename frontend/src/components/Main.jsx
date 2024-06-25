/* eslint-disable react/no-unescaped-entities */
import TemplateContainer from "./TemplateContainer";

/**
 * Initial view of the application. Renders general information about
 * the application and then the default view of template browsing view
 */
function Main() {
  return (
    <div className="container">
      <h1>Listmaker 9000</h1>
      <div className="pageInfo">
        <p>
          Make your own top list using the templates provided by our passionate
          top list template creators, explain your choices when you feel like
          it, and browse through the top lists made by other creators.
        </p>
        <p>
          Click on the template name to start ranking your own top list using
          the chosen template. And don't worry - if you feel like the template
          is missing an item, you can always add your own items too!
        </p>
      </div>
      <TemplateContainer />
    </div>
  );
}

export default Main;
