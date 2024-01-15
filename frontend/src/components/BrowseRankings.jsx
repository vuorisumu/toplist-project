import ShowRankings from "./ShowRankings";

/**
 * View where the user can browse through all rankings
 * @returns the title and content of the view
 */
function BrowseRankings() {
  return (
    <>
      <h1>Browse rankings</h1>
      <ShowRankings id={0} />
    </>
  );
}

export default BrowseRankings;
