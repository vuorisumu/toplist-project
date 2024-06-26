import ToplistContainer from "./ToplistContainer";

/**
 * View where the user can browse through all top lists
 * @returns the title and content of the view
 */
function BrowseToplists() {
  return (
    <div className="container">
      <h1>Top lists</h1>
      <ToplistContainer templateId={0} />
    </div>
  );
}

export default BrowseToplists;
