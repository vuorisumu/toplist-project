import Templates from "./Templates";

/**
 * Initial view of the application. Renders general information about
 * the application and then the default view of template browsing view
 */
function Main() {
  return (
    <div className="container">
      <h1>Main</h1>
      <Templates />
    </div>
  );
}

export default Main;
