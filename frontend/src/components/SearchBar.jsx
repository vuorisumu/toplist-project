import { useRef } from "react";
import Search from "./Search";
import { fetchAllNamesByInput } from "../util/dataHandler";

function SearchBar() {
  const searchInput = useRef("");
  const setSearch = (val) => (searchInput.current = val);

  /**
   * Pressing the enter key on default search field.
   *
   * @param {string} val - the current value of the input field
   */
  const onEnter = (val) => {
    setSearch(val);
    console.log(val);
  };

  return (
    <div className="searchContainer">
      <div className="searchInput general">
        <Search
          valueUpdated={setSearch}
          fetchFunction={fetchAllNamesByInput}
          combinedSearch={true}
          onClear={() => setSearch("")}
          onEnterKey={onEnter}
        />
      </div>
    </div>
  );
}

export default SearchBar;
