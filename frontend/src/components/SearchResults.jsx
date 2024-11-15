import { useLocation } from "react-router-dom";
import TemplateContainer from "./TemplateContainer";

function SearchResults() {
  const location = useLocation();
  const search = decodeURI(location.pathname.replace("/search/", ""));
  return (
    <div className="container">
      <h1>Search results</h1>
      <TemplateContainer />
    </div>
  );
}

export default SearchResults;
